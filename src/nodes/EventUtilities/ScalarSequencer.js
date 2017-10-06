/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009, 2017, A. Plesch, Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

// ### IntegerSequencer ###
x3dom.registerNodeType(
    "ScalarSequencer",
    "EventUtilities",
    defineClass(x3dom.nodeTypes.X3DSequencerNode,
        
        /**
         * Constructor for ScalarSequencer
         * @constructs x3dom.nodeTypes.ScalarSequencer
         * @x3dom
         * @component EventUtilities
         * @status experimental
         * @extends x3dom.nodeTypes.X3DSequencerNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc The ScalarSequencer node generates sequential discrete value_changed events selected from the keyValue field in response to each set_fraction, next, or previous event.
         */
         
        function (ctx) {
            x3dom.nodeTypes.ScalarSequencer.superClass.call(this, ctx);
            
            /**
             * Defines the set of Floats, that are used for sequencing.
             * @var {x3dom.fields.MFFloat} keyValue
             * @memberof x3dom.nodeTypes.ScalarSequencer
             * @initvalue []
             * @field x3dom
             * @instance
             */
            this.addField_MFFloat(ctx, 'keyValue', []);
        
        },
        {
        // all in base class
        }
    )
);
