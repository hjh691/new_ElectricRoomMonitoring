
function timedCount()
{
    postMessage(1);
    setTimeout("timedCount()",10000);
}

timedCount();