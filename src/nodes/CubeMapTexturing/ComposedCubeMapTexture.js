/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

/* ### ComposedCubeMapTexture ### */
x3dom.registerNodeType(
    "ComposedCubeMapTexture",
    "CubeMapTexturing",
    defineClass(x3dom.nodeTypes.X3DEnvironmentTextureNode,
        
        /**
         * Constructor for ComposedCubeMapTexture
         * @constructs x3dom.nodeTypes.ComposedCubeMapTexture
         * @x3d 3.3
         * @component CubeMapTexturing
         * @status full
         * @extends x3dom.nodeTypes.X3DEnvironmentTextureNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc The ComposedCubeMapTexture node defines a cubic environment map source as an explicit set of
         * images drawn from individual 2D texture nodes.
         */
        function (ctx) {
            x3dom.nodeTypes.ComposedCubeMapTexture.superClass.call(this, ctx);


            /**
             * Texture for the back of the cubemap
             * @var {x3dom.fields.SFNode} back
             * @memberof x3dom.nodeTypes.ComposedCubeMapTexture
             * @initvalue x3dom.nodeTypes.Texture
             * @field x3d
             * @instance
             */
            this.addField_SFNode('back',  x3dom.nodeTypes.Texture);

            /**
             * Texture for the front of the cubemap
             * @var {x3dom.fields.SFNode} front
             * @memberof x3dom.nodeTypes.ComposedCubeMapTexture
             * @initvalue x3dom.nodeTypes.Texture
             * @field x3d
             * @instance
             */
            this.addField_SFNode('front',  x3dom.nodeTypes.Texture);

            /**
             * Texture for the bottom of the cubemap
             * @var {x3dom.fields.SFNode} bottom
             * @memberof x3dom.nodeTypes.ComposedCubeMapTexture
             * @initvalue x3dom.nodeTypes.Texture
             * @field x3d
             * @instance
             */
            this.addField_SFNode('bottom', x3dom.nodeTypes.Texture);

            /**
             * Texture for the top of the cubemap
             * @var {x3dom.fields.SFNode} top
             * @memberof x3dom.nodeTypes.ComposedCubeMapTexture
             * @initvalue x3dom.nodeTypes.Texture
             * @field x3d
             * @instance
             */
            this.addField_SFNode('top',    x3dom.nodeTypes.Texture);

            /**
             * Texture for the left side of the cubemap
             * @var {x3dom.fields.SFNode} left
             * @memberof x3dom.nodeTypes.ComposedCubeMapTexture
             * @initvalue x3dom.nodeTypes.Texture
             * @field x3d
             * @instance
             */
            this.addField_SFNode('left',   x3dom.nodeTypes.Texture);

            /**
             * Texture for the right side of the cubemap
             * @var {x3dom.fields.SFNode} right
             * @memberof x3dom.nodeTypes.ComposedCubeMapTexture
             * @initvalue x3dom.nodeTypes.Texture
             * @field x3d
             * @instance
             */
            this.addField_SFNode('right',  x3dom.nodeTypes.Texture);
            this._type = "environmentMap";
            this._texids = 0;
            this._update = false;
        },
        {
            nodeChanged: function() {
                this._update = [this._cf.back, this._cf.front, this._cf.bottom, this._cf.top, this._cf.left, this._cf.right].some(
                    function(field) {
                        return x3dom.isa(field.node, x3dom.nodeTypes.RenderedTexture) &&
                            field.node._vf.update == 'always';
                    });
            },
        
            getTexUrl: function() {
                return [
                    this.getUrlOrID(this._cf.back),
                    this.getUrlOrID(this._cf.front),
                    this.getUrlOrID(this._cf.bottom),
                    this.getUrlOrID(this._cf.top),
                    this.getUrlOrID(this._cf.left),
                    this.getUrlOrID(this._cf.right)
//                     this._nameSpace.getURL(this._cf.front.node._vf.url[0]),
//                     this._nameSpace.getURL(this._cf.bottom.node._vf.url[0]),
//                     this._nameSpace.getURL(this._cf.top.node._vf.url[0]),
//                     this._nameSpace.getURL(this._cf.left.node._vf.url[0]),
//                     this._nameSpace.getURL(this._cf.right.node._vf.url[0])
                ];
            },
            getUrlOrID: function(texField) {
                var texNode = texField.node;
                if (x3dom.isa(texNode, x3dom.nodeTypes.ImageTexture)) {
                    return this._nameSpace.getURL(texNode._vf.url[0]);
                }
                if (x3dom.isa(texNode, x3dom.nodeTypes.RenderedTexture)) {
                    return texNode._vf.url[0];
                }
                return texNode._DEF || this._texids++;
            }   
        }
    )
);
