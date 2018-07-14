/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

// ### HAnimJoint ###
x3dom.registerNodeType(
    "HAnimJoint",
    "H-Anim",
    defineClass(x3dom.nodeTypes.Transform,//X3DHAnimTransformNode,
        
        /**
         * Constructor for HAnimJoint
         * @constructs x3dom.nodeTypes.HAnimJoint
         * @x3d 3.3
         * @component H-Anim
         * @status experimental
         * @extends x3dom.nodeTypes.Transform
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc Each joint in the body is represented by an HAnimJoint node, which is used to define the relationship of each body segment to its immediate parent.
         * An HAnimJoint may only be a child of another HAnimJoint node or a child within the skeleton field in the case of the HAnimJoint used as a humanoid root (i.e., an HAnimJoint may not be a child of an HAnimSegment).
         * The HAnimJoint node is also used to store other joint-specific information. In particular, a joint name is provided so that applications can identify each HAnimJoint node at run-time.
         * The HAnimJoint node may contain hints for inverse-kinematics systems that wish to control the H-Anim figure.
         * These hints include the upper and lower joint limits, the orientation of the joint limits, and a stiffness/resistance value.
         */
        function (ctx) {
            x3dom.nodeTypes.HAnimJoint.superClass.call(this, ctx);


            /**
             *
             * @var {x3dom.fields.SFString} name
             * @memberof x3dom.nodeTypes.HAnimJoint
             * @initvalue ""
             * @field x3dom
             * @instance
             */
            this.addField_SFString(ctx, 'name', "");

            /**
             *
             * @var {x3dom.fields.MFNode} displacers
             * @memberof x3dom.nodeTypes.HAnimJoint
             * @initvalue x3dom.nodeTypes.HAnimDisplacer
             * @field x3dom
             * @instance
             */
            this.addField_MFNode('displacers', x3dom.nodeTypes.HAnimDisplacer);


            /**
             *
             * @var {x3dom.fields.SFRotation} limitOrientation
             * @memberof x3dom.nodeTypes.HAnimJoint
             * @initvalue 0,0,1,0
             * @field x3dom
             * @instance
             */
            this.addField_SFRotation(ctx, 'limitOrientation', 0, 0, 1, 0);

            /**
             *
             * @var {x3dom.fields.MFFloat} llimit
             * @memberof x3dom.nodeTypes.HAnimJoint
             * @initvalue []
             * @field x3dom
             * @instance
             */
            this.addField_MFFloat(ctx, 'llimit', []);

            /**
             *
             * @var {x3dom.fields.MFFloat} ulimit
             * @memberof x3dom.nodeTypes.HAnimJoint
             * @initvalue []
             * @field x3dom
             * @instance
             */
            this.addField_MFFloat(ctx, 'ulimit', []);

            /**
             *
             * @var {x3dom.fields.MFInt32} skinCoordIndex
             * @memberof x3dom.nodeTypes.HAnimJoint
             * @initvalue []
             * @field x3dom
             * @instance
             */
            this.addField_MFInt32(ctx, 'skinCoordIndex', []);

            /**
             *
             * @var {x3dom.fields.MFFloat} skinCoordWeight
             * @memberof x3dom.nodeTypes.HAnimJoint
             * @initvalue []
             * @field x3dom
             * @instance
             */
            this.addField_MFFloat(ctx, 'skinCoordWeight', []);
        
            /**
             *
             * @var {x3dom.fields.MFFloat} stiffness
             * @memberof x3dom.nodeTypes.HAnimJoint
             * @initvalue 0 0 0
             * @field x3dom
             * @instance
             */
            this.addField_SFFloat(ctx, 'stiffness', '0 0 0');
        
            //this._humanoid = null;
        
        },
        {
            nodeChanged: function()
            {
                this._humanoid = _findRoot(this._xmlNode);
                
                var _findRoot = function(domNode) {
                    var parent = domNode.parentNode._x3domNode; //_parentNodes not yet available
                    if (x3dom.isa(parent, x3dom.nodeTypes.Scene)) return false
                    if (x3dom.isa(parent, x3dom.nodeTypes.HAnimHumanoid)) return parent
                    return _findRoot(parent._xmlNode);
                }
            }
        }    
                
                //TODO: for skinned animation
                //custom collectDrawableObjects which receives skinCoord and skinNormal fields
                //or use fieldChanged and search for skinCoord
                //or search for Humanoid, skinCoord at nodeChanged
    )
);
/*
<ProtoDeclare name='Joint' appinfo='The Joint node is used as a building block to describe the articulations of the humanoid figure. Each articulation of the humanoid figure is represented by a Joint node each of which is organized into a hierarchy that describes the overall skeleton of the humanoid.' documentation=' http://H-Anim.org/Specifications/H-Anim2001/part1/Joint.html '>
<ProtoInterface>
<field name='name' type='SFString' accessType='inputOutput'/> 
<field name='ulimit' type='MFFloat' accessType='inputOutput'/> 
<field name='llimit' type='MFFloat' accessType='inputOutput'/> 
<field name='limitOrientation' type='SFRotation' value='0 0 1 0' accessType='inputOutput'/> 
<field name='skinCoordIndex' type='MFInt32' accessType='inputOutput'/> 
<field name='skinCoordWeight' type='MFFloat' accessType='inputOutput'/> 
<field name='stiffness' type='MFFloat' value='0 0 0' accessType='inputOutput'/> 
<field name='translation' type='SFVec3f' value='0 0 0' accessType='inputOutput'/> 
<field name='rotation' type='SFRotation' value='0 0 1 0' accessType='inputOutput'/> 
<field name='scale' type='SFVec3f' value='1 1 1' accessType='inputOutput'/> 
<field name='scaleOrientation' type='SFRotation' value='0 0 1 0' accessType='inputOutput'/> 
<field name='center' type='SFVec3f' value='0 0 0' accessType='inputOutput'/> 
<field name='bboxCenter' type='SFVec3f' value='0 0 0' accessType='initializeOnly'/> 
<field name='bboxSize' type='SFVec3f' value='-1 -1 -1' accessType='initializeOnly'/> 
<field name='children' type='MFNode' accessType='inputOutput'/> 
<field name='addChildren' type='MFNode' accessType='inputOnly'/> 
<field name='removeChildren' type='MFNode' accessType='inputOnly'/>
</ProtoInterface> 
<ProtoBody>
<Transform DEF='JointTransform'>
<IS>
<connect nodeField='translation' protoField='translation'/> 
<connect nodeField='rotation' protoField='rotation'/> 
<connect nodeField='scale' protoField='scale'/> 
<connect nodeField='scaleOrientation' protoField='scaleOrientation'/> 
<connect nodeField='center' protoField='center'/> 
<connect nodeField='bboxCenter' protoField='bboxCenter'/> 
<connect nodeField='bboxSize' protoField='bboxSize'/> 
<connect nodeField='children' protoField='children'/> 
<connect nodeField='addChildren' protoField='addChildren'/> 
<connect nodeField='removeChildren' protoField='removeChildren'/>
</IS>
</Transform>
</ProtoBody>
</ProtoDeclare> 
*/
