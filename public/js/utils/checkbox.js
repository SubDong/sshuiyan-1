/**
 * Created by XiaoWei on 2015/3/25.
 */
function getCheckbox(tagName){
    var radioValue=document.getElementsByName(tagName);
    var type=[];
    for(var i=0;i<radioValue.length;i++){
        if(radioValue[i].checked==true)type.push(radioValue[i].value);
    }
    return type.toString();
}