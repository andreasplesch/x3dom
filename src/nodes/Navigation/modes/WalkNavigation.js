/** @namespace x3dom */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C) 2017 Andreas Plesch
 * Dual licensed under the MIT and GPL
 */

/* ### WalkNavigation ### */

// use DefaultNavigation
x3dom.WalkNavigation = function(navigationNode)
{
    x3dom.DefaultNavigation.call(this, navigationNode);
};

x3dom.WalkNavigation.prototype = Object.create(x3dom.DefaultNavigation.prototype);
x3dom.WalkNavigation.prototype.constructor = x3dom.WalkNavigation; // necessary ?

// redefine onDrag
x3dom.WalkNavigation.prototype.onDrag = function(view, x, y, buttonState)
{
    var navi = this.navi;

    var navType = navi.getType();
    var navRestrict = navi.getExplorationMode(); // may not apply to walk mode ?

    if (navRestrict === 0) {
        return;
    }

    var viewpoint = view._scene.getViewpoint();

    var dx = x - view._lastX;
    var dy = y - view._lastY;
    
    view._isMoving = true;

    view._dx = dx;
    view._dy = dy;

    view._lastX = x;
    view._lastY = y;
    // double check, probably not necessary
    if (navType === "walk") {return;}
    console.log("#### CHECK: in WalkNavigation but nav. type is not walk !");
};

// other event handlers from DefaultNavigation could also be simplified
x3dom.DefaultNavigation.prototype.navigateTo = function(view, timeStamp)
{
    var navi = this.navi;
    var navType = navi.getType();
    var savedPickingInfo = null;
    
    var needNavAnim = (view._currentInputType == x3dom.InputTypes.NAVIGATION) &&
                      //( navType === "game" ||
                      (
                            view._lastButton > 0 //&&
//                         (navType.indexOf("fly") >= 0 ||
//                          navType === "walk" ||
//                          navType === "helicopter" ||
//                          navType.substr(0, 5) === "looka"))
                        );
    
    view._deltaT = timeStamp - view._lastTS;
    
    var removeZeroMargin = function(val, offset) {
        if (val > 0) {
            if (val <= offset) {
                return 0;
            } else {
                return val - offset;
            }
        } else if (val <= 0) {
            if (val >= -offset) {
                return 0;
            } else {
                return val + offset;
            }
        }
    };
    
    // slightly increasing slope function
    var humanizeDiff = function(scale, diff) {
        return ((diff < 0) ? -1 : 1 ) * Math.pow(scale * Math.abs(diff), 1.65 /*lower is easier on the novice*/);
    };

    if (needNavAnim)
    {

        //Save picking info if available
        if( view._pickingInfo.pickObj !== null ) {

            savedPickingInfo = {
                pickPos: view._pickingInfo.pickPos,
                pickNorm: view._pickingInfo.pickNorm,
                pickObj: view._pickingInfo.pickObj,
                firstObj: view._pickingInfo.firstObj,
                lastObj: view._pickingInfo.lastObj,
                lastClickObj: view._pickingInfo.lastClickObj,
                shadowObjectId: view._pickingInfo.shadowObjectId
            };
        }

        var avatarRadius = 0.25;
        var avatarHeight = 1.6;
        var avatarKnee = 0.75;  // TODO; check max. step size

        if (navi._vf.avatarSize.length > 2) {
            avatarRadius = navi._vf.avatarSize[0];
            avatarHeight = navi._vf.avatarSize[1];
            avatarKnee = navi._vf.avatarSize[2];
        }
        
        

        // get current view matrix
        var currViewMat = view.getViewMatrix();
        var dist = 0;
        
        // estimate one screen size for motion puposes so navigation behaviour
        // is less dependent on screen geometry. view makes no sense for very
        // anisotropic cases, so it should probably be configurable.
        var screenSize = Math.min(view._width, view._height);
        var rdeltaX = removeZeroMargin((view._pressX - view._lastX) / screenSize, 0.01);
        var rdeltaY = removeZeroMargin((view._pressY - view._lastY) / screenSize, 0.01);
        
        var userXdiff = humanizeDiff(1, rdeltaX);
        var userYdiff = humanizeDiff(1, rdeltaY);

        // check if forwards or backwards (on right button)
        var step = (view._lastButton & 2) ? -1 : 1;
        step *= (view._deltaT * navi._vf.speed);
        
        // factor in delta time and the nav speed setting
        var userXstep = view._deltaT * navi._vf.speed * userXdiff;
        var userYstep = view._deltaT * navi._vf.speed * userYdiff;
        
        var phi = Math.PI * view._deltaT * userXdiff;
        var theta = Math.PI * view._deltaT * userYdiff;
        
        if (view._needNavigationMatrixUpdate === true)
        {
            view._needNavigationMatrixUpdate = false;
          
            // reset examine matrices to identity
            view._rotMat = x3dom.fields.SFMatrix4f.identity();
            view._transMat = x3dom.fields.SFMatrix4f.identity();
            view._movement = new x3dom.fields.SFVec3f(0, 0, 0);

            var angleX = 0;
            var angleY = Math.asin(currViewMat._02);
            var C = Math.cos(angleY);
            
            if (Math.abs(C) > 0.0001) {
                angleX = Math.atan2(-currViewMat._12 / C, currViewMat._22 / C);
            }

            // too many inversions here can lead to distortions
            view._flyMat = currViewMat.inverse();
            
            view._from = view._flyMat.e3();
            view._at = view._from.subtract(view._flyMat.e2());

//             if (navType === "helicopter")
//                 view._at.y = view._from.y;

            /*
             //lookat, lookaround
             if (navType.substr(0, 5) === "looka")
             {
             view._up = view._flyMat.e1();
             }
             //all other modes
             else
             {
             //initially read up-vector from current orientation and keep it
             if (typeof view._up == 'undefined')
             {
             view._up = view._flyMat.e1();
             }
             }
             */

            view._up = view._flyMat.e1();

            view._pitch = angleX * 180 / Math.PI;
            view._yaw = angleY * 180 / Math.PI;
            view._eyePos = view._from.negate();
        }

        var tmpAt = null, tmpUp = null, tmpMat = null;
        var q, temp, fin;
        var lv, sv, up;

//         if (navType === "game")
//         {
//             view._pitch += view._dy;
//             view._yaw   += view._dx;

//             if (view._pitch >=  89) view._pitch = 89;
//             if (view._pitch <= -89) view._pitch = -89;
//             if (view._yaw >=  360) view._yaw -= 360;
//             if (view._yaw < 0) view._yaw = 360 + view._yaw;
            
//             view._dx = 0;
//             view._dy = 0;

//             var xMat = x3dom.fields.SFMatrix4f.rotationX(view._pitch / 180 * Math.PI);
//             var yMat = x3dom.fields.SFMatrix4f.rotationY(view._yaw / 180 * Math.PI);

//             var fPos = x3dom.fields.SFMatrix4f.translation(view._eyePos);

//             view._flyMat = xMat.mult(yMat).mult(fPos);

//             // Finally check floor for terrain following (TODO: optimize!)
//             var flyMat = view._flyMat.inverse();

//             var tmpFrom = flyMat.e3();
//             tmpUp = new x3dom.fields.SFVec3f(0, -1, 0);

//             tmpAt = tmpFrom.add(tmpUp);
//             tmpUp = flyMat.e0().cross(tmpUp).normalize();

//             tmpMat = x3dom.fields.SFMatrix4f.lookAt(tmpFrom, tmpAt, tmpUp);
//             tmpMat = tmpMat.inverse();

//             view._scene._nameSpace.doc.ctx.pickValue(view, view._width/2, view._height/2,
//                         view._lastButton, tmpMat, view.getProjectionMatrix().mult(tmpMat));

//             if (view._pickingInfo.pickObj)
//             {
//                 dist = view._pickingInfo.pickPos.subtract(tmpFrom).length();
//                 //x3dom.debug.logWarning("Floor collision at dist=" + dist.toFixed(4));

//                 tmpFrom.y += (avatarHeight - dist);
//                 flyMat.setTranslate(tmpFrom);

//                 view._eyePos = flyMat.e3().negate();
//                 view._flyMat = flyMat.inverse();

//                 view._pickingInfo.pickObj = null;
//             }

//             view._scene.getViewpoint().setView(view._flyMat);

//             return needNavAnim;
//         }   // game
//         else if (navType === "helicopter") {
//             var typeParams = navi.getTypeParams();

            

//             if (view._lastButton & 2) // up/down levelling
//             {
//                 var stepUp = 200 * userYstep;
//                 typeParams[1] += stepUp;
//                 navi.setTypeParams(typeParams);
//             }

//             if (view._lastButton & 1) {  // forward/backward motion
//                 step = 300 * userYstep;
//             }
//             else {
//                 step = 0;
//             }
            
//             theta = typeParams[0];
//             view._from.y = typeParams[1];
//             view._at.y = view._from.y;

//             // rotate around the up vector
//             q = x3dom.fields.Quaternion.axisAngle(view._up, phi);
//             temp = q.toMatrix();

//             fin = x3dom.fields.SFMatrix4f.translation(view._from);
//             fin = fin.mult(temp);

//             temp = x3dom.fields.SFMatrix4f.translation(view._from.negate());
//             fin = fin.mult(temp);

//             view._at = fin.multMatrixPnt(view._at);

//             // rotate around the side vector
//             lv = view._at.subtract(view._from).normalize();
//             sv = lv.cross(view._up).normalize();
//             up = sv.cross(lv).normalize();

//             lv = lv.multiply(step);

//             view._from = view._from.add(lv);
//             view._at = view._at.add(lv);

//             // rotate around the side vector
//             q = x3dom.fields.Quaternion.axisAngle(sv, theta);
//             temp = q.toMatrix();

//             fin = x3dom.fields.SFMatrix4f.translation(view._from);
//             fin = fin.mult(temp);

//             temp = x3dom.fields.SFMatrix4f.translation(view._from.negate());
//             fin = fin.mult(temp);

//             var at = fin.multMatrixPnt(view._at);

//             view._flyMat = x3dom.fields.SFMatrix4f.lookAt(view._from, at, up);

//             view._scene.getViewpoint().setView(view._flyMat.inverse());

//             return needNavAnim;
//         }   // helicopter

        // rotate around the up vector
        q = x3dom.fields.Quaternion.axisAngle(view._up, phi);
        temp = q.toMatrix();

        fin = x3dom.fields.SFMatrix4f.translation(view._from);
        fin = fin.mult(temp);

        temp = x3dom.fields.SFMatrix4f.translation(view._from.negate());
        fin = fin.mult(temp);

        view._at = fin.multMatrixPnt(view._at);

        // rotate around the side vector
        lv = view._at.subtract(view._from).normalize();
        sv = lv.cross(view._up).normalize();
        up = sv.cross(lv).normalize();
        //view._up = up;

        q = x3dom.fields.Quaternion.axisAngle(sv, theta);
        temp = q.toMatrix();

        fin = x3dom.fields.SFMatrix4f.translation(view._from);
        fin = fin.mult(temp);

        temp = x3dom.fields.SFMatrix4f.translation(view._from.negate());
        fin = fin.mult(temp);

        view._at = fin.multMatrixPnt(view._at);

        // forward along view vector
//         if (navType.substr(0, 5) !== "looka")
//         {
//             var currProjMat = view.getProjectionMatrix();

//             if (navType !== "freefly") {
//                 if (step < 0) {
//                     // backwards: negate viewing direction
//                     tmpMat = new x3dom.fields.SFMatrix4f();
//                     tmpMat.setValue(view._last_mat_view.e0(), view._last_mat_view.e1(),
//                                     view._last_mat_view.e2().negate(), view._last_mat_view.e3());

//                     view._scene._nameSpace.doc.ctx.pickValue(view, view._width/2, view._height/2,
//                                 view._lastButton, tmpMat, currProjMat.mult(tmpMat));
//                 }
//                 else {
//                     view._scene._nameSpace.doc.ctx.pickValue(view, view._width/2, view._height/2, view._lastButton);
//                 }
//                 if (view._pickingInfo.pickObj)
//                 {
//                     dist = view._pickingInfo.pickPos.subtract(view._from).length();

//                     if (dist <= avatarRadius) {
//                         step = 0;
//                     }
//                 }
//             }

            lv = view._at.subtract(view._from).normalize().multiply(step);

            view._at = view._at.add(lv);
            view._from = view._from.add(lv);

            // finally attach to ground when walking
            if (navType === "walk")
            {
                tmpAt = view._from.addScaled(up, -1.0);
                tmpUp = sv.cross(up.negate()).normalize();  // lv

                tmpMat = x3dom.fields.SFMatrix4f.lookAt(view._from, tmpAt, tmpUp);
                tmpMat = tmpMat.inverse();

                view._scene._nameSpace.doc.ctx.pickValue(view, view._width/2, view._height/2,
                            view._lastButton, tmpMat, currProjMat.mult(tmpMat));
                
                var walkDamper = 2; // >= 1 ; configurable ? speed dependant ?

                if (view._pickingInfo.pickObj)
                {
                    dist = view._pickingInfo.pickPos.subtract(view._from).length();
                    dist = (avatarHeight - dist)/walkDamper;
                    
                    view._at = view._at.add(up.multiply(dist));
                    view._from = view._from.add(up.multiply(dist));
                }
            }
            view._pickingInfo.pickObj = null;
        }
        
        view._flyMat = x3dom.fields.SFMatrix4f.lookAt(view._from, view._at, up);

        view._scene.getViewpoint().setView(view._flyMat.inverse());

        //Restore picking info if available
        if( savedPickingInfo !== null ) {

            view._pickingInfo = savedPickingInfo;
            
        }
    }

    return needNavAnim;
};
