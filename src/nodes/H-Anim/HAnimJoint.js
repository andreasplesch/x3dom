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
                
                function _findRoot(domNode) {
                    var parent = domNode.parentNode._x3domNode; //_parentNodes not yet available
                    if (x3dom.isa(parent, x3dom.nodeTypes.Scene)) return false
                    if (x3dom.isa(parent, x3dom.nodeTypes.HAnimHumanoid)) return parent
                    return _findRoot(parent._xmlNode);
                }
            },
        
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
                // still do skinning
                var skinCoord = this._humanoid._cf.skinCoord.node;
                if (planeMask < 0 && !skinCoord) {
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
                    var localClipPlanes = [];

                    for (var j = 0; j < n; j++) {
                        if ( (cnode = this._childNodes[j]) ) {
                            if (x3dom.isa(cnode, x3dom.nodeTypes.ClipPlane) && cnode._vf.on && cnode._vf.enabled) {
                                localClipPlanes.push({plane: cnode, trafo: childTransform});
                            }
                        }
                    }

                    clipPlanes = localClipPlanes.concat(clipPlanes);
                }
                
                //skin
                
                var skinCoordIndex, skinCoordWeight, humanoid, trafo, displacers;
                
                if ( skinCoord ) {
                    
                    humanoid = this._humanoid;
                    trafo = humanoid.getCurrentTransform().inverse().mult(childTransform);//factor in root trafo
                    
                    // first add displacers
                    displacers = this._cf.displacers.nodes;
                    if ( displacers.length !== 0) {
                        displacers.forEach( function(displacer) {
                            var weight = displacer._vf.weight;
                            var MFdisplacements = displacer._vf.displacements;
                            var offsets = MFdisplacements.length;
                            if (offsets !== 0) {
                                displacer._vf.coordIndex.forEach( function(coordIndex, i) {
                                    skinCoord._vf.point[coordIndex] = skinCoord._vf.point[coordIndex]
                                        .addScaled( trafo.multMatrixVec( MFdisplacements[i % offsets] ), weight );
                                });
                            }
                        });
                    }
                    
                    // then add weighted skinCoordIndex
                    skinCoordIndex = this._vf.skinCoordIndex;
                    if ( skinCoordIndex.length !== 0 ) {
                        skinCoordWeight = this._vf.skinCoordWeight;
                        //blend in contribution rel. to undeformed resting
                        skinCoordIndex.forEach(function(coordIndex, i) {
                            //update coord
                            var restCoord = humanoid._restCoords[coordIndex];
                            skinCoord._vf.point[coordIndex] = skinCoord._vf.point[coordIndex]
                                .add( trafo.multMatrixPnt( restCoord )
                                    .subtract( restCoord )
                                    .multiply( skinCoordWeight[ Math.min( i, skinCoordWeight.length-1 ) ])
                                 ); //in case of not enough weights
                        });
                    }
                }
                
                var skinNormal = this._humanoid._cf.skinNormal.node;
                if (skinNormal) {
                    skinCoordIndex = this._vf.skinCoordIndex;
                    if (skinCoordIndex.length !== 0) {
                        skinCoordWeight = this._vf.skinCoordWeight;
                        humanoid = this._humanoid;
                        trafo = humanoid.getCurrentTransform().inverse().mult(childTransform).inverse().transpose();//factor in root trafo
                        //blend in contribution rel. to undeformed resting
                        skinCoordIndex.forEach(function(coordIndex, i) {
                            //update coord
                            var restNormal = humanoid._restNormals[coordIndex];
                            skinNormal._vf.vector[coordIndex] = skinNormal._vf.vector[coordIndex]
                                .add(trafo.multMatrixVec( restNormal )
                                    .subtract( restNormal )
                                    .multiply( skinCoordWeight[ Math.min( i, skinCoordWeight.length-1 ) ])
                                 ); //in case of not enough weights
                        });
                    }
                }
                
                for (var i=0; i<n; i++) {
                    if ( (cnode = this._childNodes[i]) ) {
                        cnode.collectDrawableObjects(childTransform, drawableCollection, singlePath, invalidateCache, planeMask, clipPlanes);
                    }
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
