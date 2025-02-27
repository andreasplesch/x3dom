/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

/* ### FontStyle ### */
x3dom.registerNodeType(
    "FontStyle",
    "Text",
    defineClass( x3dom.nodeTypes.X3DFontStyleNode,

        /**
         * Constructor for FontStyle
         * @constructs x3dom.nodeTypes.FontStyle
         * @x3d 3.3
         * @component Text
         * @status full
         * @extends x3dom.nodeTypes.X3DFontStyleNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc The FontStyle node defines the size, family, and style used for Text nodes, as well as the direction of the text strings and any language-specific rendering techniques used for non-English text.
         */
        function ( ctx )
        {
            x3dom.nodeTypes.FontStyle.superClass.call( this, ctx );

            /**
             * Defines the text family.
             * @var {x3dom.fields.MFString} family
             * @memberof x3dom.nodeTypes.FontStyle
             * @initvalue ['SERIF']
             * @field x3d
             * @instance
             */
            this.addField_MFString( ctx, "family", [ "SERIF" ] );

            /**
             * Specifies whether the text is shown horizontally or vertically.
             * @var {x3dom.fields.SFBool} horizontal
             * @memberof x3dom.nodeTypes.FontStyle
             * @initvalue true
             * @field x3d
             * @instance
             */
            this.addField_SFBool( ctx, "horizontal", true );

            /**
             * Specifies where the text is anchored. The default of ["BEGIN", "FIRST"] is the ISO spec. default. It deviates
             * from ["MIDDLE", "MIDDLE"], the older x3dom default which may require scene tuning.
             * @var {x3dom.fields.MFString} justify
             * @range ["BEGIN","END","FIRST","MIDDLE",""]
             * @memberof x3dom.nodeTypes.FontStyle
             * @initvalue ['BEGIN', 'FIRST']
             * @field x3d
             * @instance
             */
            this.addField_MFString( ctx, "justify", [ "BEGIN", "FIRST" ] );

            /**
             * The language field specifies the context of the language for the text string in the form of a language and a country in which that language is used.
             * @var {x3dom.fields.SFString} language
             * @memberof x3dom.nodeTypes.FontStyle
             * @initvalue ""
             * @field x3d
             * @instance
             */
            this.addField_SFString( ctx, "language", "" );

            /**
             * Specifies whether the text is shown from left to right or from right to left.
             * @var {x3dom.fields.SFBool} leftToRight
             * @memberof x3dom.nodeTypes.FontStyle
             * @initvalue true
             * @field x3d
             * @instance
             */
            this.addField_SFBool( ctx, "leftToRight", true );

            /**
             * Sets the size of the text.
             * @var {x3dom.fields.SFFloat} size
             * @range [0, inf]
             * @memberof x3dom.nodeTypes.FontStyle
             * @initvalue 1.0
             * @field x3d
             * @instance
             */
            this.addField_SFFloat( ctx, "size", 1.0 );

            /**
             * Sets the spacing between lines of text, relative to the text size.
             * @var {x3dom.fields.SFFloat} spacing
             * @range [0, inf]
             * @memberof x3dom.nodeTypes.FontStyle
             * @initvalue 1.0
             * @field x3d
             * @instance
             */
            this.addField_SFFloat( ctx, "spacing", 1.0 );

            /**
             * Sets the text style.
             * @var {x3dom.fields.SFString} style
             * @range ["PLAIN","BOLD","ITALIC","BOLDITALIC",""]
             * @memberof x3dom.nodeTypes.FontStyle
             * @initvalue "PLAIN"
             * @field x3d
             * @instance
             */
            this.addField_SFString( ctx, "style", "PLAIN" );

            /**
             * Specifies whether the text flows from top to bottom or from bottom to top.
             * @var {x3dom.fields.SFBool} topToBottom
             * @memberof x3dom.nodeTypes.FontStyle
             * @initvalue true
             * @field x3d
             * @instance
             */
            this.addField_SFBool( ctx, "topToBottom", true );

            /**
             * Sets the quality of the text rendering as an oversampling factor.
             * @var {x3dom.fields.SFFloat} quality
             * @range [0, inf]
             * @memberof x3dom.nodeTypes.FontStyle
             * @initvalue 2.0
             * @field x3dom
             * @instance
             */
            this.addField_SFFloat( ctx, "quality", 2.0 );

            /**
             * urls of web font files to use
             * @var {x3dom.fields.MFString} url
             * @memberof x3dom.nodeTypes.FontStyle
             * @initvalue []
             * @field x3dom
             * @instance
             */
            this.addField_MFString( ctx, "url", [] );
            this._hasFontFace = false;
        },
        {
            nodeChanged : function ()
            {
                this.addFont();
            },

            fieldChanged : function ( fieldName )
            {
                if ( fieldName == "family" || fieldName == "horizontal" || fieldName == "justify" ||
                    fieldName == "language" || fieldName == "leftToRight" || fieldName == "size" ||
                    fieldName == "spacing" || fieldName == "style" || fieldName == "topToBottom" ||
                    fieldName == "url" )
                {
                    this._parentNodes.forEach( function ( node )
                    {
                        node._parentNodes.forEach( function ( textnode )
                        {
                            textnode.setAllDirty();
                        } );
                    } );
                    if ( this._hasFontFace )
                    {
                        document.fonts.delete( this._fontFace );
                        this._hasFontFace = false;
                    }
                    this.addFont();
                }
            },

            addFont : function ()
            {
                const url = this._vf.url[ 0 ];
                if ( !url ) { return; }
                var fonts = this._vf.family.toString();
                // clean attribute values and split in array
                fonts = fonts.trim().replace( /\'/g, "" ).replace( /\,/, " " );
                fonts = fonts.split( " " );

                var font_family = fonts.map( function ( s )
                {
                    if ( s == "SANS" )
                    {
                        return "Verdana, sans-serif";
                    }
                    else if ( s == "SERIF" )
                    {
                        return "Georgia, serif";
                    }
                    else if ( s == "TYPEWRITER" )
                    {
                        return "monospace";
                    }
                    else
                    {
                        return "" + s + "";
                    }  // 'Verdana'
                } ).join( "," );

                var font_style = this._vf.style.toString().replace( /\'/g, "" );
                var font_weight = "normal";
                switch ( font_style.toUpperCase() )
                {
                    case "PLAIN":
                        font_style = "normal";
                        break;
                    case "BOLD":
                        font_style = "normal";
                        font_weight = "bold";
                        break;
                    case "ITALIC":
                        font_style = "italic";
                        break;
                    case "BOLDITALIC":
                        font_style = "italic";
                        font_weight = "bold";
                        break;
                    default:
                        font_style = "normal";
                }
                const urls = this._vf.url.map( ( url ) => "url(" + url + ")" ).join( "," );
                this._fontFace = new FontFace(
                    font_family,
                    urls, // same as src of @font-face, can have multiple urls
                    { "style": font_style, "weight": font_weight, "display": "swap" } );
                this._hasFontFace = true;
                try
                {
                    document.fonts.add( this._fontFace );
                }
                catch ( error )
                {
                    x3dom.debug.logError( error.message );
                }
            }
        }
    )
);

x3dom.nodeTypes.FontStyle.defaultNode = function ()
{
    if ( !x3dom.nodeTypes.FontStyle._defaultNode )
    {
        x3dom.nodeTypes.FontStyle._defaultNode = new x3dom.nodeTypes.FontStyle();
        x3dom.nodeTypes.FontStyle._defaultNode.nodeChanged();
    }
    return x3dom.nodeTypes.FontStyle._defaultNode;
};
