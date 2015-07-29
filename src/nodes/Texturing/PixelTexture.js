/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

/* ### PixelTexture ### */
x3dom.registerNodeType(
    "PixelTexture",
    "Texturing",
    defineClass(x3dom.nodeTypes.X3DTextureNode,
        
        /**
         * Constructor for PixelTexture
         * @constructs x3dom.nodeTypes.PixelTexture
         * @x3d 3.3
         * @component Texturing
         * @status full
         * @extends x3dom.nodeTypes.X3DTextureNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc The PixelTexture node defines a 2D image-based texture map as an explicit array of pixel values (image field) and parameters controlling tiling repetition of the texture onto geometry.
         */
        function (ctx) {
            x3dom.nodeTypes.PixelTexture.superClass.call(this, ctx);


            /**
             * The image that delivers the pixel data.
             * @var {x3dom.fields.SFImage} image
             * @memberof x3dom.nodeTypes.PixelTexture
             * @initvalue 0,0,0
             * @field x3d
             * @instance
             */
            this.addField_SFImage(ctx, 'image', 0, 0, 0);
            
            /**
             * rescaled dimensions of image.
             * @var {x3dom.fields.SFImage} image
             * @memberof x3dom.nodeTypes.PixelTexture
             * @initvalue 0,0,0
             * @field x3d
             * @instance
             */
            this.addField_MFInt32(ctx, 'dimensions', []);
        
        },
        {
            nodeChanged: function()
            {
                var img = this._vf.image;
                //copy function does not work, do it here
                this._imageSrc = new x3dom.fields.SFImage();
                this._imageSrc.width = img.width;
                this._imageSrc.height = img.height;
                this._imageSrc.comp = img.comp;
                this._imageSrc.setPixels(img.getPixels());
                if (this._vf.dimensions)
                {
                    //do sanity checking
                    var x, y, xsize, ysize, height, width, xSrc, ySrc, xScale, yScale ;
                    xsize = this._vf.dimensions[0];
                    ysize = this._vf.dimensions[1];
                    var comp = this._imageSrc.comp;
                    
                    var image = new x3dom.fields.SFImage(xsize, ysize, comp, Array(xsize*ysize*comp));
                    
                    // var image = new x3dom.fields.SFImage();
                    // image.comp = this._imageSrc.comp;
                    // image.width = xsize;
                    // image.height = ysize;
                    // set length, so that setPixel works
                    image.array.length = xsize * ysize * image.comp;
                    height = this._imageSrc.height;
                    width = this._imageSrc.width;
                    xScale = width/xsize;
                    yScale = height/ysize;
                    for (y = 0; y < ysize; y++)
                    {
                        ySrc = y*yScale;
                        for (x = 0; x < xsize; x++)
                        {
                            //scale to src
                            xSrc = x*xScale;
                            image.setPixel(x, y, this._imageSrc.getPixel(xSrc, ySrc));
                        }
                    }
                    this._vf.image = image;
                }
            },
            
            fieldChanged: function(fieldName)
            {
                if (fieldName == "image") {
                    this.invalidateGLObject();
                }
            },

            getWidth: function() {
                return this._vf.image.width;
            },

            getHeight: function() {
                return this._vf.image.height;
            },

            getComponents: function() {
                return this._vf.image.comp;
            },

            setPixel: function(x, y, color, update) {
                update = (update == undefined) ? true : update;

                if (this._x3domTexture) {
                    this._x3domTexture.setPixel(x, y, [
                        color.r*255,
                        color.g*255,
                        color.b*255,
                        color.a*255 ], update );
                    this._vf.image.setPixel(x, y, color);
                }
                else
                {
                    this._vf.image.setPixel(x, y, color);
                    if( update ) {
                        this.invalidateGLObject();
                    }
                }

            },

            getPixel: function(x, y) {
                return this._vf.image.getPixel(x, y);
            },

            setPixels: function(pixels, update) {
                update = (update == undefined) ? true : update;

                this._vf.image.setPixels(pixels);

                if( update ) {
                    this.invalidateGLObject();
                }
            },

            getPixels: function() {
                return this._vf.image.getPixels();
            }
        }
    )
);
