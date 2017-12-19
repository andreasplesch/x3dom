/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * (C)2017 A.Plesch, Waltham, MA, USA
 * Dual licensed under the MIT and GPL
 */

/* ### ImageTexture3D ### */
x3dom.registerNodeType(
    "ImageTexture3D",
    "Texturing3D",
    //cannot use a texture class to avoid parsing too early
    defineClass(x3dom.nodeTypes.X3DAppearanceChildNode,//ImageTextureAtlas, //X3DTexture3DNode,
        
        /**
         * Constructor for ImageTexture3D
         * @constructs x3dom.nodeTypes.ImageTexture3D
         * @x3d 3.3
         * @component Texturing3D
         * @status full
         * @extends x3dom.nodeTypes.X3DTexture3DNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc The ImageTexture3D node defines a texture map by specifying a single image file that contains complete 3D data and general parameters for mapping texels to geometry.
         * The texture is read from the URL specified by the url field. When the url field contains no values ([]), texturing is disabled.
         */
        function (ctx) {
            x3dom.nodeTypes.ImageTexture3D.superClass.call(this, ctx);
            
            //additional fields, since we have to generate a new TextureAtlas node
            /**
             * Specifies whether the children are shown or hidden outside the texture.
             * @var {x3dom.fields.SFBool} hideChildren
             * @memberof x3dom.nodeTypes.Texture
             * @initvalue true
             * @field x3dom
             * @instance
             */
            this.addField_SFBool(ctx, 'hideChildren', true);
            
            /**
             * Specifies the channel count of the texture. 0 means the system should figure out the count automatically.
             * @var {x3dom.fields.SFInt32} origChannelCount
             * @range [0, inf]
             * @memberof x3dom.nodeTypes.X3DTextureNode
             * @initvalue 0
             * @field x3dom
             * @instance
             */
            this.addField_SFInt32(ctx, 'origChannelCount', 0);

            /**
             * Sets the url to a resource.
             * @var {x3dom.fields.MFString} url
             * @memberof x3dom.nodeTypes.X3DTextureNode
             * @initvalue []
             * @field x3dom
             * @instance
             */
            this.addField_MFString(ctx, 'url', []);

            /**
             * Specifies whether the texture is repeated in s direction.
             * @var {x3dom.fields.SFBool} repeatS
             * @memberof x3dom.nodeTypes.X3DTextureNode
             * @initvalue true
             * @field x3dom
             * @instance
             */
            this.addField_SFBool(ctx, 'repeatS', true);

            /**
             * Specifies whether the texture is repeated in t direction.
             * @var {x3dom.fields.SFBool} repeatT
             * @memberof x3dom.nodeTypes.X3DTextureNode
             * @initvalue true
             * @field x3dom
             * @instance
             */
            this.addField_SFBool(ctx, 'repeatT', true);

            /**
             * Specifies whether the texture is scaled to the next highest power of two. (Needed, when texture repeat is enabled and texture size is non power of two)
             * @var {x3dom.fields.SFBool} scale
             * @memberof x3dom.nodeTypes.X3DTextureNode
             * @initvalue true
             * @field x3dom
             * @instance
             */
            this.addField_SFBool(ctx, 'scale', true);

            /**
             * Cross Origin Mode
             * @var {x3dom.fields.SFString} crossOrigin
             * @memberof x3dom.nodeTypes.X3DTextureNode
             * @initvalue ""
             * @field x3d
             * @instance
             */
            this.addField_SFString(ctx, 'crossOrigin', '');

            /**
             * Sets a TextureProperty node.
             * @var {x3dom.fields.SFNode} textureProperties
             * @memberof x3dom.nodeTypes.X3DTextureNode
             * @initvalue x3dom.nodeTypes.TextureProperties
             * @field x3dom
             * @instance
             */
            this.addField_SFNode('textureProperties', x3dom.nodeTypes.TextureProperties);
      
            //this.addField_SFNode('_ImageTextureAtlas', x3dom.nodeTypes.ImageTextureAtlas);

            //initialisation
            ctx.xmlNode.setAttribute('containerField' ,''); //remove containerfield since this is not the actual voxels node
            
            this._loaded = false;
            this._ImageTextureAtlas = new x3dom.nodeTypes.ImageTextureAtlas();
            var t = this._ImageTextureAtlas;
            t._nameSpace = this._nameSpace;
      
            t._cf.textureProperties = this._cf.textureProperties;
            t._vf.crossOrigin = this._vf.crossOrigin;
            t._vf.scale = this._vf.scale;
            t._vf.repeatT = this._vf.repeatT;
            t._vf.repeatS = this._vf.repeatS;
            t._vf.url = this._vf.url;
            t._vf.origChannelCount = this._vf.origChannelCount;
            t._vf.hideChildren = this._vf.hideChildren;
            //hack, should go in X3DTextureNode 
            t.parentAdded = function(parent)
            {
                if (x3dom.isa(parent, x3dom.nodeTypes.X3DShapeNode)) {
                    parent._dirty.texture = true;
                    return;
                }
                Array.forEach(parent._parentNodes, function (shape) {
                    // THINKABOUTME: this is a bit ugly, cleanup more generically
                    if (x3dom.isa(shape, x3dom.nodeTypes.Shape)) {
                        shape._dirty.texture = true;
                    }
                    else {
                        // Texture maybe in MultiTexture or CommonSurfaceShader
                        Array.forEach(shape._parentNodes, function (realShape) {
                            if (x3dom.isa(shape, x3dom.nodeTypes.Shape)) { //necessary here
                                realShape._dirty.texture = true;
                            }
                        });
                    }
                });
            }
        },
        {    
            nodeChanged: function (){
                
                //peek inside to set dimensions
                var nrrd ;
                var that = this;
                this.tryURLs( this._vf.url ).then( processNRRD ).catch(function(){console.log("no nrrd");});
                function processNRRD (response) {
                    if (that._loaded) { return; }
                    nrrd = x3dom.nrrd.parse(response);
                    that._loaded = true;
                    //console.log(nrrd, response);
                    if (nrrd.dimension != 3 && (nrrd.dimension != 4 && nrrd.sizes[0] == 1 )) { 
                        x3dom.debug.logWarning("only nrrd with 3 or 4 dimensions, here: " + nrrd.dimension);
                    }
                    that.setFields(nrrd.sizes);
                    nrrd = null;
                    that._xmlNode.parentElement._x3domNode.addChild(that._ImageTextureAtlas, 'voxels');
                    that._xmlNode.parentElement._x3domNode.nodeChanged();
                    that._nameSpace.doc.needRender = true;
                }
            },
      
            setFields: function(sizes) {
              
                var numberOfSlices = sizes[sizes.length - 1];
                this._ImageTextureAtlas._vf.numberOfSlices = numberOfSlices;
                var width = Math.sqrt(numberOfSlices);
                this._ImageTextureAtlas._vf.slicesOverX = x3dom.Utils.nextBestPowerOfTwo(width);
                this._ImageTextureAtlas._vf.slicesOverY = x3dom.Utils.nextBestPowerOfTwo(numberOfSlices / this._ImageTextureAtlas._vf.slicesOverX);
              
            },
      
            tryURLs: function(dataURLs, callback) {
                
                //recursive
              
                var fetchFirst = function (urls) {
                    if (urls.length == 0) {return Promise.rejected('no URL');}
                    return fetch(urls[0]).then(
                        function(response){
                            if (response.ok) {
                                console.log('fetch ok', urls, response);
                                return response.arrayBuffer().then(
                                    function(buffer) {
                                        if (buffer && buffer.byteLength > 0) return buffer;
                                        console.log('fetched buffer empty', buffer);
                                        return fetchFirst(urls.slice(1));
                                    }
                                )
                            }
                            console.log('fetch not ok, trying', urls[1]);
                            return fetchFirst(urls.slice(1));
                        },
                        function(reason){
                            console.log('fetch rejected', reason);
                            return fetchFirst(urls.slice(1));
                        }
                    )
                };              
                return fetchFirst(dataURLs);             
            }
        }
    )
);
