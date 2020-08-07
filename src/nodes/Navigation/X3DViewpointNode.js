/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

/* ### X3DViewpointNode ### */
x3dom.registerNodeType(
    "X3DViewpointNode",
    "Navigation",
    defineClass( x3dom.nodeTypes.X3DBindableNode,

        /**
         * Constructor for X3DViewpointNode
         * @constructs x3dom.nodeTypes.X3DViewpointNode
         * @x3d 3.3
         * @component Navigation
         * @status experimental
         * @extends x3dom.nodeTypes.X3DBindableNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc A node of node type X3DViewpointNode defines a specific location in the local coordinate system from which the user may view the scene.
         */
        function ( ctx )
        {
            x3dom.nodeTypes.X3DViewpointNode.superClass.call( this, ctx );

            /**
             * Specifies the near clipping plane, alias for zNear
             * @var {x3dom.fields.SFFloat} nearClippingPlane
             * @range -1 or [0, inf]
             * @memberof x3dom.nodeTypes.X3DViewpointNode
             * @initvalue -1
             * @field x3d
             * @instance
             */
            this.addField_SFFloat( ctx, "nearClippingPlane", -1 );

            /**
             * Specifies the far clipping plane, alias for zFar
             * @var {x3dom.fields.SFFloat} farClippingPlane
             * @range -1 or [0, inf]
             * @memberof x3dom.nodeTypes.X3DViewpointNode
             * @initvalue -1
             * @field x3dom
             * @instance
             */
            this.addField_SFFloat( ctx, "farClippingPlane", -1 );

            /**
             * When the viewAll field is set to TRUE or a viewpoint is bound with viewAll field TRUE,
             * the current view is modified to change the centerOfRotation field to match center of the bounding box for the entire visible scene,
             * and the orientation field is modified to aim at that point. Finally, the zoom position or fieldofview is adjusted to contain
             * the entire scene in the current viewing window. If needed, the near and far clipping planes shall be adjusted to allow viewing
             * the entire scene. When the value of the viewAll field is changed from TRUE to FALSE, no change in the current view occurs.
             * @var {x3dom.fields.SFBool} viewAll
             * @memberof x3dom.nodeTypes.X3DViewpointNode
             * @initvalue false
             * @field x3d
             * @instance
             */
            this.addField_SFBool( ctx, "viewAll", false );

            /**
             * Defines a dedicated NavigationInfo node for this X3DViewpointNode. The specified NavigationInfo node receives
             * a set_bind TRUE event at the time when the parent node is bound and receives a set_bind FALSE at the time
             * when the parent node is unbound.
             * @var {x3dom.fields.SFBool} navigationInfo
             * @memberof x3dom.nodeTypes.X3DViewpointNode
             * @initvalue null
             * @field x3d
             * @instance
             */
            this.addField_SFNode( "navigationInfo", x3dom.nodeTypes.NavigationInfo );

            // attach some convenience accessor methods to dom/xml node
            if ( ctx && ctx.xmlNode )
            {
                var domNode = ctx.xmlNode;

                if ( !domNode.resetView && !domNode.getFieldOfView &&
                    !domNode.getNear && !domNode.getFar )
                {
                    domNode.resetView = function ()
                    {
                        var that = this._x3domNode;

                        that.resetView();
                        that._nameSpace.doc.needRender = true;
                    };

                    domNode.getFieldOfView = function ()
                    {
                        return this._x3domNode.getFieldOfView();
                    };

                    domNode.getNear = function ()
                    {
                        return this._x3domNode.getNear();
                    };

                    domNode.getFar = function ()
                    {
                        return this._x3domNode.getFar();
                    };
                }
            }
        },
        {
            activate : function ( prev )
            {
                var viewarea = this._nameSpace.doc._viewarea;
                prev = prev || this;
                var target = this;
                if ( this._bindAnimation )
                {
                    if ( this._vf.viewAll )
                    {
                        var sceneBBox = this._runtime.getSceneBBox();
                        target = viewarea.getFitViewMatrix( sceneBBox.min, sceneBBox.max, prev, true );
                    }
                    viewarea.animateTo( target, prev._autoGen ? null : prev );
                }
                viewarea._needNavigationMatrixUpdate = true;

                if ( this._cf.navigationInfo.node )
                {
                    this._cf.navigationInfo.node.bind( true );
                }

                x3dom.nodeTypes.X3DBindableNode.prototype.activate.call( this, prev );
            },

            deactivate : function ( prev )
            {
                x3dom.nodeTypes.X3DBindableNode.prototype.deactivate.call( this, prev );
            },

            getTransformation : function ()
            {
                return this.getCurrentTransform();
            },

            getCenterOfRotation : function ()
            {
                return new x3dom.fields.SFVec3f( 0, 0, 0 );
            },

            setCenterOfRotation : function ( cor )
            {
                this._vf.centerOfRotation.setValues( cor );   // method overwritten by Viewfrustum
            },

            getFieldOfView : function ()
            {
                return Math.PI / 2.0;
            },

            /**
             * Sets the (local) view matrix
             * @param newView
             */
            setView : function ( newView )
            {
                var mat = this.getCurrentTransform();
                this._viewMatrix = newView.mult( mat );
            },

            /**
             * Sets an absolute view matrix in world coordinates
             * @param newView
             */
            setViewAbsolute : function ( newView )
            {
                this._viewMatrix = newView;
            },

            setProjectionMatrix : function ( matrix )
            {

            },

            resetView : function ()
            {
                // see derived class
            },

            getNear : function ()
            {
                return 0.1;
            },

            getFar : function ()
            {
                return 10000;
            },

            getImgPlaneHeightAtDistOne : function ()
            {
                return 2.0;
            },

            getViewMatrix : function ()
            {
                return null;
            },

            getProjectionMatrix : function ( aspect )
            {
                return null;
            },

            setZoom : function ( value )
            {

            }
        }
    )
);
