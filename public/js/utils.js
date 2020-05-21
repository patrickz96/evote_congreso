function search_text(){

    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("search-buses");
    filter = input.value.toUpperCase();
    ul = document.getElementById("list_buses");
    li = ul.getElementsByTagName("li");
    
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function GetActualDriver(list_drivers){
    return JSON.parse($.ajax({
        type: "POST",
        dataType: "json",
        url: "/admin/actual_driver/all",
        data: {list_drivers: list_drivers},
        cache: false,
        async: false
    }).responseText);
}

function GetIdCompany(){
    return JSON.parse($.ajax({
        type: "GET",
        url: "/admin/get_info_user",
        cache: false,
        async: false
    }).responseText).id_company;
}


function GetRoutes(){
    return JSON.parse($.ajax({
        type: "GET",
        url: "/admin/route/all",
        cache: false,
        async: false
    }).responseText);
}

function GetTokenSupervisor(){
    return JSON.parse($.ajax({
        type:"GET",
        url: "/admin/getToken",
        cache:false,
        async:false
    }).responseText).token;
}

function GetHostname(){
    return JSON.parse($.ajax({
        type:"GET",
        url: "/admin/gethostname",
        cache:false,
        async:false
    }).responseText).hostname;
}
