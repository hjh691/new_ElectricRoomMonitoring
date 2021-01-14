
function timedCount()
{
    postMessage(1);
    setTimeout("timedCount()",60000);
}

timedCount();