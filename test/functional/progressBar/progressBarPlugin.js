/*
Copyright (c) 2021, Andreas Plesch, Waltham, MA
All rights reserved.
*/

(function wrapper () {
    // save existing runtime.ready
    var runtimeReady = x3dom.runtime.ready;
    x3dom.runtime.ready = function()
    {
        var x3d = document.querySelector('x3d');
        var progressDiv = x3d.querySelector(".x3dom-progress");
        progressDiv.children[0].style.display='none';
        progressDiv.children[1].style.display='none';
        var barDiv = document.createElement('div');
        barDiv.classList = "x3dom-progress-barDiv";
        var backgroundColor1 = getComputedStyle(barDiv).getPropertyValue("--background-color-1") || 'rgba(253,110,55,0.4)';
        var backgroundColor2 = getComputedStyle(barDiv).getPropertyValue("--background-color-2") || 'rgba(255,255,255,0.1)';
        progressDiv.style.backgroundClip = "border-box";
        var max = x3d.querySelectorAll('inline').length - 2; // guess downloads, subtract vr inlines
        var requests = 0;
        var delays = 2;
        var value = max - requests;
        barDiv.innerHTML = '<progress class="x3dom-animated x3dom-progress-bar"></progress><percent class="x3dom-progress-percent">0%</percent>';
        progressDiv.appendChild(barDiv);
        var progress = barDiv.querySelector('progress');
        var progressText = barDiv.querySelector('percent');
        progress.max = max;
        progress.value = max / 100; //show a bit of progress
        var updateBar = function ( mlist )
        {
            mlist.forEach( m =>
            {
                if (m.type == "childList")
                {
                    //requests = x3dom.RequestManager.loadedRequests;//+m.target.textContent;
                    requests = +m.target.textContent;
                    if (requests == 0 && delays )
                    {
                        x3d.runtime.canvas.doc.downloadCount = 1;
                        delays--;
                        setTimeout(function(){ x3d.runtime.canvas.doc.downloadCount = 0; }, 4 * 1000 );
                    }
                    value = max - requests;  // count up
                    if ( value / max > progress.value / max )
                    {
                        if ( requests > max )
                        {
                            max = requests;
                            progress.max = max;
                        }
                        {
                            progress.value = value;
                            progressText.childNodes[0].textContent = Math.round(100 * progress.value/max) + "%";
                            //barDiv.style.backgroundColor = value % 2 ? backgroundColor1 : backgroundColor2;
                        }
                    }
                }
            });
        }
        var o = new MutationObserver( updateBar );
        o.observe( progressDiv, {subtree: true, childList: true} );
        if ( runtimeReady )
        {
          runtimeReady();
        }
    }
} () );
