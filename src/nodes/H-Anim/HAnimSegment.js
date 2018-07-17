/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

// ### HAnimSegment ###
x3dom.registerNodeType(
    "HAnimSegment",
    "H-Anim",
    defineClass(x3dom.nodeTypes.X3DGroupingNode,
        
        /**
         * Constructor for HAnimSegment
         * @constructs x3dom.nodeTypes.HAnimSegment
         * @x3d 3.3
         * @component H-Anim
         * @status full
         * @extends x3dom.nodeTypes.X3DGroupingNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc Each body segment is stored in an HAnimSegment node.
         * The HAnimSegment node is a grouping node that will typically contain either a number of Shape nodes or perhaps Transform nodes that position the body part within its coordinate system.
         */
        function (ctx) {
            x3dom.nodeTypes.HAnimSegment.superClass.call(this, ctx);

            /**
             *
             * @var {x3dom.fields.SFString} name
             * @memberof x3dom.nodeTypes.HAnimSegment
             * @initvalue ""
             * @field x3dom
             * @instance
             */
            this.addField_SFString(ctx,'name', "");

            /**
             *
             * @var {x3dom.fields.SFVec3f} centerOfMass
             * @memberof x3dom.nodeTypes.HAnimSegment
             * @initvalue 0,0,0
             * @field x3dom
             * @instance
             */
            this.addField_SFVec3f(ctx, 'centerOfMass', 0, 0, 0);

            /**
             *
             * @var {x3dom.fields.SFFloat} mass
             * @memberof x3dom.nodeTypes.HAnimSegment
             * @initvalue 0
             * @field x3dom
             * @instance
             */
            this.addField_SFFloat(ctx, 'mass', 0);

            /**
             *
             * @var {x3dom.fields.MFFloat} momentsOfInertia
             * @memberof x3dom.nodeTypes.HAnimSegment
             * @initvalue [0,0,0,0,0,0,0,0,0]
             * @field x3dom
             * @instance
             */
            this.addField_MFFloat(ctx, 'momentsOfInertia', [0, 0, 0, 0, 0, 0, 0, 0, 0]);


            /**
             *
             * @var {x3dom.fields.SFNode} coord
             * @memberof x3dom.nodeTypes.HAnimSegment
             * @initvalue x3dom.nodeTypes.X3DCoordinateNode
             * @field x3dom
             * @instance
             */
            this.addField_SFNode('coord', x3dom.nodeTypes.X3DCoordinateNode);

            /**
             *
             * @var {x3dom.fields.MFNode} displacers
             * @memberof x3dom.nodeTypes.HAnimSegment
             * @initvalue x3dom.nodeTypes.HAnimDisplacer
             * @field x3dom
             * @instance
             */
            this.addField_MFNode('displacers', x3dom.nodeTypes.HAnimDisplacer);
        
        },
        {
            // TODO coord      add functionality
            // TODO displacers add functionality
            // See Joint for possible displacer implementation:
            // custom collectDrawables
            // look for displacers
            // apply weighted displacements to coord field
            // force update of parents of coord field by fieldChanged("coord") here
            // or better in Humanoid (needs a list of affected segment shapes)
            // sofar no example scenes
        }
    )
);
/*
<ProtoDeclare name='Segment' appinfo='The Segment node is used describe the attributes of the physical links between the joints of the humanoid figure. Each body part (pelvis thigh calf etc.) of the humanoid figure is represented by a Segment node.' documentation=' http://H-Anim.org/Specifications/H-Anim2001/part1/Segment.html '>
<ProtoInterface>
<field name='name' type='SFString' accessType='inputOutput'/> 
<field name='mass' type='SFFloat' value='0' accessType='inputOutput'/> 
<field name='centerOfMass' type='SFVec3f' value='0 0 0' accessType='inputOutput'/> 
<field name='momentsOfInertia' type='MFFloat' value='0 0 0 0 0 0 0 0 0' accessType='inputOutput'/> 
<field name='bboxCenter' type='SFVec3f' value='0 0 0' accessType='initializeOnly'/> 
<field name='bboxSize' type='SFVec3f' value='-1 -1 -1' accessType='initializeOnly'/> 
<field name='children' type='MFNode' accessType='inputOutput'/> 
<field name='addChildren' type='MFNode' accessType='inputOnly'/> 
<field name='removeChildren' type='MFNode' accessType='inputOnly'/> 
<field name='coord' type='SFNode' value='NULL' accessType='inputOutput' 
 appinfo='contains Coordinate nodes'/> 
<field name='displacers' type='MFNode' accessType='inputOutput' 
 appinfo='contains Displacer nodes'/>
</ProtoInterface> 
<ProtoBody>
<Group DEF='SegmentGroup'>
<IS>
<connect nodeField='bboxCenter' protoField='bboxCenter'/> 
<connect nodeField='bboxSize' protoField='bboxSize'/> 
<connect nodeField='children' protoField='children'/> 
<connect nodeField='addChildren' protoField='addChildren'/> 
<connect nodeField='removeChildren' protoField='removeChildren'/>
</IS>
</Group>
</ProtoBody>
</ProtoDeclare> 
*/
