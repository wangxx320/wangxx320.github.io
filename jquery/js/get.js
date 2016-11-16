


    $(function(){

        getJson("../data/students.json",function(data){
                var stus=JSON.parse(data);
                //console.log(stus);
                stus.forEach(function(item,index){
                    //console.log(item);
                    $(".chose").eq(index).append("<a>"+item.id+"</a>"+"<a>"+item.name+"</a>"+"<a>"+item.relname+"</a>");
                });
                    $(".chose a").on("click",function(){
                        //console.log(1);
                        $(".chose").children('a').removeClass('active3');
                        $(this).addClass('active3');
                });
        });

            



            function getJson(url,callback){
            	var request = new XMLHttpRequest();
                request.open("GET",url);
                request.send();
                request.onreadystatechange=function(){
                    if(request.readyState===4&&request.status===200){
                        var json=request.responseText;
                        callback(json);
                    }
                };
            }
});