x3dom.runtime.ready = function()
{
    var x3d = document.querySelector('x3d');
    var progressDiv = x3d.querySelector(".x3dom-progress");
    progressDiv.children[0].style.display='none';
    progressDiv.children[1].style.display='none';
    var barDiv = document.createElement('div');
    barDiv.classList = "x3dom-progress-barDiv";
    var backgroundColor1 = getComputedStyle(progressDiv).getPropertyValue("--background-color-1") || 'rgba(253,110,55,0.4)';
    var backgroundColor2 = getComputedStyle(progressDiv).getPropertyValue("--background-color-2") || 'rgba(255,255,255,0.1)';
    progressDiv.style.backgroundClip = "border-box";
    var max = x3d.querySelectorAll('inline').length; // guess downloads
    var value = 0;
    barDiv.innerHTML = '<progress class="x3dom-animated x3dom-progress-bar"></progress><percent class="x3dom-progress-percent">0%</percent>';
    progressDiv.appendChild(barDiv);
    var progress = barDiv.querySelector('progress');
    var progressText = barDiv.querySelector('percent');
    progress.max = max;
    var updateBar = function ( mlist )
    {
        mlist.forEach( m =>
        {
            if (m.type == "childList")
            {
                //value = x3dom.RequestManager.loadedRequests;//+m.target.textContent;
                value = +m.target.textContent;
                if ( value > max )
                {
                    max = value;
                    progress.max = max;
                }
                progress.value = max - value; // count up
                progressText.childNodes[0].textContent = Math.round(100 * progress.value/max) + "%";

                progressDiv.style.backgroundColor = value % 2 ? backgroundColor1 : backgroundColor2;
            }
        });
    }
    var o = new MutationObserver( updateBar );
    o.observe( progressDiv, {subtree: true, childList: true} );
}
