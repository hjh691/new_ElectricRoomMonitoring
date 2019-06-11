
function timedCount()
{
    postMessage(1);
    setTimeout("timedCount()",1000);
}

timedCount();