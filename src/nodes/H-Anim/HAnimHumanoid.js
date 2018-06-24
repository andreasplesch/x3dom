/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

// ### HAnimHumanoid ###
x3dom.registerNodeType(
    "HAnimHumanoid",
    "H-Anim",
    defineClass(x3dom.nodeTypes.Transform,//X3DHAnimTransformNode,
        
        /**
         * Constructor for HAnimHumanoid
         * @constructs x3dom.nodeTypes.HAnimHumanoid
         * @x3d 3.3
         * @component H-Anim
         * @status full
         * @extends x3dom.nodeTypes.Transform
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc The HAnimHumanoid node is used to store human-readable data such as author and copyright information, as well as to store references to the HAnimJoint, HAnimSegment, and HAnimSite nodes in addition to serving as a container for the entire humanoid.
         * Thus, it serves as a central node for moving the humanoid through its environment.
         */
        function (ctx) {
            x3dom.nodeTypes.HAnimHumanoid.superClass.call(this, ctx);

            /**
             *
             * @var {x3dom.fields.SFString} name
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue ""
             * @field x3d
             * @instance
             */
            this.addField_SFString(ctx, 'name', "");

            /**
             *
             * @var {x3dom.fields.SFString} version
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue ""
             * @field x3d
             * @instance
             */
            this.addField_SFString(ctx, 'version', "");

            /**
             *
             * @var {x3dom.fields.MFString} info
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue []
             * @field x3d
             * @instance
             */
            this.addField_MFString(ctx, 'info', []);


            /**
             *
             * @var {x3dom.fields.MFNode} joints
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue x3dom.nodeTypes.HAnimJoint
             * @field x3d
             * @instance
             */
            this.addField_MFNode('joints', x3dom.nodeTypes.HAnimJoint);

            /**
             *
             * @var {x3dom.fields.MFNode} segments
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue x3dom.nodeTypes.HAnimSegment
             * @field x3d
             * @instance
             */
            this.addField_MFNode('segments', x3dom.nodeTypes.HAnimSegment);

            /**
             *
             * @var {x3dom.fields.MFNode} sites
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue x3dom.nodeTypes.HAnimSite
             * @field x3d
             * @instance
             */
            this.addField_MFNode('sites', x3dom.nodeTypes.HAnimSite);

            /**
             *
             * @var {x3dom.fields.MFNode} skeleton
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue x3dom.nodeTypes.HAnimJoint
             * @field x3d
             * @instance
             */
            this.addField_MFNode('skeleton', x3dom.nodeTypes.HAnimJoint);

            /**
             *
             * @var {x3dom.fields.MFNode} skin
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue x3dom.nodeTypes.X3DChildNode
             * @field x3d
             * @instance
             */
            this.addField_MFNode('skin', x3dom.nodeTypes.X3DChildNode);

            /**
             *
             * @var {x3dom.fields.MFNode} skinCoord
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue x3dom.nodeTypes.X3DCoordinateNode
             * @field x3d
             * @instance
             */
            this.addField_MFNode('skinCoord', x3dom.nodeTypes.X3DCoordinateNode);

            /**
             *
             * @var {x3dom.fields.MFNode} skinNormal
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue x3dom.nodeTypes.X3DNormalNode
             * @field x3d
             * @instance
             */
            this.addField_MFNode('skinNormal', x3dom.nodeTypes.X3DNormalNode);

            /**
             *
             * @var {x3dom.fields.MFNode} viewpoints
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue x3dom.nodeTypes.HAnimSite
             * @field x3d
             * @instance
             */
            this.addField_MFNode('viewpoints', x3dom.nodeTypes.HAnimSite);
        
            /**
             *
             * @var {x3dom.fields.MFVec3f} jointBindingPositions
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue [0 0 0]
             * @field x3d
             * @instance
             */
            this.addField_MFVec3f(ctx, 'jointBindingPositions', [0, 0, 0]);
        
            /**
             *
             * @var {x3dom.fields.MFVec3f} jointBindingRotations
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue  [0 0 1 0]
             * @field x3d
             * @instance
             */
            this.addField_MFRotation(ctx, 'jointBindingRotations', [0, 0, 1, 0]);
        
            /**
             *
             * @var {x3dom.fields.MFVec3f} jointBindingScales
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue [1 1 1]
             * @field x3d
             * @instance
             */
            this.addField_MFVec3f(ctx, 'jointBindingScales', [1, 1, 1]);
        
            /**
             *
             * @var {x3dom.fields.MFVec3f} skeletalConfiguration
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue 'BASIC'
             * @field x3d
             * @instance
             */
            this.addField_SFString(ctx, 'skeletalConfiguration', 'BASIC');
        
            /**
             *
             * @var {x3dom.fields.MFVec3f} skinBindingCoords
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue []
             * @field x3d
             * @instance
             */
            this.addField_MFVec3f(ctx, 'skinBindingCoords', []);
 
            /**
             *
             * @var {x3dom.fields.MFVec3f} skinBindingNormals
             * @memberof x3dom.nodeTypes.HAnimHumanoid
             * @initvalue []
             * @field x3d
             * @instance
             */
            this.addField_MFVec3f(ctx, 'skinBindingNormals', []);
           
        },
        {
            collectDrawableObjects: function (transform, drawableCollection, singlePath, invalidateCache, planeMask, clipPlanes)
            {
                // check if multi parent sub-graph, don't cache in that case
                if (singlePath && (this._parentNodes.length > 1))
                    singlePath = false;

                // an invalid world matrix or volume needs to be invalidated down the hierarchy
                if (singlePath && (invalidateCache = invalidateCache || this.cacheInvalid()))
                    this.invalidateCache();

                // check if sub-graph can be culled away or render flag was set to false
                planeMask = drawableCollection.cull(transform, this.graphState(), singlePath, planeMask);
                if (planeMask < 0) {
                    return;
                }

                var cnode, childTransform;

                if (singlePath) {
                    // rebuild cache on change and reuse world transform
                    if (!this._graph.globalMatrix) {
                        this._graph.globalMatrix = this.transformMatrix(transform);
                    }
                    childTransform = this._graph.globalMatrix;
                }
                else {
                    childTransform = this.transformMatrix(transform);
                }

                var n = this._childNodes.length;

                if (x3dom.nodeTypes.ClipPlane.count > 0) {
                    var localClipectPlanes = [];

                    for (var j = 0; j < n; j++) {
                        if ( (cnode = this._childNodes[j]) ) {
                            if (x3dom.isa(cnode, x3dom.nodeTypes.ClipPlane) && cnode._vf.on && cnode._vf.enabled) {
                                localClipPlanes.push({plane: cnode, trafo: childTransform});
                            }
                        }
                    }

                    clipPlanes = localClipPlanes.concat(clipPlanes);
                }
                
                for (var i=0; i<n; i++) {
                    if ( (cnode = this._childNodes[i]) ) {
                        // only collect from skeleton field
                        if (this._cf.skeleton.nodes.includes(cnode))
                            cnode.collectDrawableObjects(childTransform, drawableCollection, singlePath, invalidateCache, planeMask, clipPlanes);
                        // skin, others TODO
                    }
                }
            },
            nodeChanged: function()
            {
                //check for joints MFNodes
            },
            // TODO skeleton   contains the HumanoidRoot Joint object functionality: map similar to children of Group
            // TODO skeleton   add functionality for HAnimSite also (unaffected by internal transformations)
            // TODO joints     add functionality
            fieldChanged: function(fieldName)
            {
                switch(fieldName)
                {
                    case "joints":
                        // nothing
                        break;
                    default:
                        // nothing
                        break;
                }
            }
            // TODO segments   add functionality
            // TODO sites      add functionality
            // TODO skin...    add functionality
            // TODO viewpoints add functionality
        }
    )
);
/*
<ProtoDeclare name='Humanoid' appinfo='The Humanoid node serves as overall container for the Joint Segment Site and Viewpoint nodes which define the skeleton geometry and landmarks of the humanoid figure. Additionally the node provides a means for defining information about the author copyright and usage restrictions of the model.' documentation=' http://H-Anim.org/Specifications/H-Anim2001/part1/Humanoid.html '>
<ProtoInterface>
<!-- H-Anim v1.1 field definitions --> 
<field name='name' type='SFString' accessType='inputOutput'/> 
<field name='version' type='SFString' value='1.1' accessType='inputOutput' 
 appinfo='legal values: 1.1 or 2.0'/> 
<field name='humanoidVersion' type='SFString' accessType='inputOutput' 
 appinfo='Version of the humanoid being modeled. Hint: H-anim version 2.0'/> 
<field name='info' type='MFString' accessType='inputOutput'/> 
<field name='translation' type='SFVec3f' value='0 0 0' accessType='inputOutput'/> 
<field name='rotation' type='SFRotation' value='0 0 1 0' accessType='inputOutput'/> 
<field name='center' type='SFVec3f' value='0 0 0' accessType='inputOutput'/> 
<field name='scale' type='SFVec3f' value='1 1 1' accessType='inputOutput'/> 
<field name='scaleOrientation' type='SFRotation' value='0 0 1 0' accessType='inputOutput'/> 
<field name='bboxCenter' type='SFVec3f' value='0 0 0' accessType='initializeOnly'/> 
<field name='bboxSize' type='SFVec3f' value='-1 -1 -1' accessType='initializeOnly'/> 
<field name='humanoidBody' type='MFNode' accessType='inputOutput' 
 appinfo='H-Anim 1.1 field container for body geometry Hint: replaced by 2.0 skeleton' 
 documentation=' http://H-Anim.org/Specifications/H-Anim1.1/#humanoid '/> 
<field name='skeleton' type='MFNode' accessType='inputOutput' 
 appinfo='H-Anim 2.0 field container for body geometry Hint: replaces 1.1 humanoidBody' 
 documentation=' http://H-Anim.org/Specifications/H-Anim2001/part1/Humanoid.html '/> 
<field name='joints' type='MFNode' accessType='inputOutput' 
 appinfo='Container field for Joint nodes'/> 
<field name='segments' type='MFNode' accessType='inputOutput' 
 appinfo='Container field for Segment nodes'/> 
<field name='sites' type='MFNode' accessType='inputOutput' 
 appinfo='Container field for Site nodes'/> 
<field name='viewpoints' type='MFNode' accessType='inputOutput' 
 appinfo='Container field for Viewpoint nodes'/> 
<field name='skinCoord' type='SFNode' value='NULL' accessType='inputOutput' 
 appinfo='Hint: H-anim version 2.0'/> 
<field name='skinNormal' type='SFNode' value='NULL' accessType='inputOutput' 
 appinfo='Hint: H-anim version 2.0'/>
</ProtoInterface> 
<ProtoBody>
<Transform DEF='HumanoidTransform'>
<IS>
<connect nodeField='translation' protoField='translation'/> 
<connect nodeField='rotation' protoField='rotation'/> 
<connect nodeField='scale' protoField='scale'/> 
<connect nodeField='scaleOrientation' protoField='scaleOrientation'/> 
<connect nodeField='center' protoField='center'/> 
<connect nodeField='bboxCenter' protoField='bboxCenter'/> 
<connect nodeField='bboxSize' protoField='bboxSize'/>
</IS> 
<Group DEF='HumanoidGroup1'>
<IS>
<connect nodeField='children' protoField='humanoidBody'/>
</IS>
</Group> 
<Group DEF='HumanoidGroup2'>
<IS>
<connect nodeField='children' protoField='skeleton'/>
</IS>
</Group> 
<Group DEF='HumanoidGroup3'>
<IS>
<connect nodeField='children' protoField='viewpoints'/>
</IS>
</Group>
</Transform>
</ProtoBody>
</ProtoDeclare> 
*/
