/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

// ### ColorInterpolator ###
x3dom.registerNodeType(
    "ColorInterpolator",
    "Interpolation",
    defineClass( x3dom.nodeTypes.X3DInterpolatorNode,

        /**
         * Constructor for ColorInterpolator
         * @constructs x3dom.nodeTypes.ColorInterpolator
         * @x3d 3.3
         * @component Interpolation
         * @status full
         * @extends x3dom.nodeTypes.X3DInterpolatorNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc The ColorInterpolator node interpolates among a list of MFColor key values to produce an SFColor (RGB) value_changed event.
         * The number of colours in the keyValue field shall be equal to the number of key frames in the key field.
         * A linear interpolation using the value of set_fraction as input is performed in HSV space.
         * The results are undefined when interpolating between two consecutive keys with complementary hues.
         */
        function ( ctx )
        {
            x3dom.nodeTypes.ColorInterpolator.superClass.call( this, ctx );

            /**
             * Defines the set of data points, that are used for interpolation.
             * @var {x3dom.fields.MFColor} keyValue
             * @memberof x3dom.nodeTypes.ColorInterpolator
             * @initvalue []
             * @field x3d
             * @instance
             */
            this.addField_MFColor( ctx, "keyValue", [] );

            this._lastValue = new x3dom.fields.SFColor();
            this.fieldChanged( "keyValue" );
        },
        {
            fieldChanged : function ( fieldName )
            {
                if ( fieldName === "set_fraction" )
                {
                    // temporarily switch to HSV for interpolation
                    this._vf.keyValue = this._keyValueHSV;
                    var value = this.linearInterp( this._vf.set_fraction, function ( a, b, t )
                    {
                        var mix = a.multiply( 1.0 - t ).add( b.multiply( t ) );
                        return mix.setHSV( mix.r, mix.g, mix.b );
                    } );

                    // switch back
                    this._vf.keyValue = this._keyValue;

                    if ( value != undefined && !value.equals( this._lastValue, 0.0001 ) )
                    {
                        this._lastValue = value;
                        this.postMessage( "value_changed", value );
                    }
                }
                if ( fieldName === "keyValue" )
                {
                    this._keyValueHSV = this._vf.keyValue.map( function ( color )
                    {
                        var hsv = color.getHSV();
                        return new x3dom.fields.SFColor( hsv[ 0 ], hsv[ 1 ], hsv[ 2 ] );
                    } );
                    this._keyValue = this._vf.keyValue.copy();
                }
            }
        }
    )
);
