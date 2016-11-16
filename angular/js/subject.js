/**
 * Created by lichunyu on 16/9/22.
 * 题目管理的js模块
 * 切换单选题与复选题时，选项是否正确不能被重置
 * 所选方向时默认绑定不上是空值
 */
angular.module("app.subject",["ng","ngRoute"])
    .controller("SubjectCheckController",["$routeParams","subjectService","$location",
        function ($routeParams,subjectService,$location) {
            subjectService.checkSubject($routeParams.id,$routeParams.state,function (data) {
                alert(data);
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            });
            //$location.path("/AllSubject/a/0/b/0/c/0/d/0");
        }])
    .controller("subjectDelController",["$routeParams","subjectService","$location",
        function ($routeParams,subjectService,$location) {
            console.log($routeParams);
            var flag=confirm("确认删除吗？");
            if(flag){
                var id=$routeParams.id;
                subjectService.delSubject(id,function (data) {
                    alert(data);
                });
                //页面发生跳转
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            }else{
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            }
    }])
    .controller("subjectController",["$scope","commonService","subjectService","$routeParams","$location",
        function ($scope,commonService,subjectService,$routeParams,$location) {
            //将路由参数绑定到作用域中
            $scope.params = $routeParams;
            //添加页面绑定的对象
            $scope.subject={
                typeId:3,
                levelId:1,
                departmentId:1,
                topicId:1,
                stem:"",
                answer:"",//简答题答案
                fx:"",
                choiceContent:[],
                //choiceCorrect:[]
                choiceCorrect:[false,false,false,false],
            };
            $scope.submit=function () {
                subjectService.saveSubject($scope.subject,function (data) {
                    //此时data为后台返回的值为保存成功
                    alert(data);
                });
                var subject={
                    typeId:3,
                    levelId:1,
                    departmentId:1,
                    topicId:1,
                    stem:"",
                    answer:"",//简答题答案
                    fx:"",
                    choiceContent:[],
                    choiceCorrect:[false,false,false,false]
                };
                //保存题目完成后重置题目信息
                //利用angular.copy将局部的subject拷贝给作用域初始subject属性
                //替代使用路由以避免重新加载页面的代价
                angular.copy(subject,$scope.subject);
            };

            $scope.submitAndClose=function () {
                subjectService.saveSubject($scope.subject,function (data) {
                    alert(data);
                    //跳转到列表页，用户体验更好
                    $location.path("/AllSubject/a/0/b/0/c/0/d/0");
                });
            };

            //获取所有题目类型,题目难度级别，题目所属部门，题目所属知识点
            commonService.getAllTypes(function (data) {
                $scope.types = data;
            });
            commonService.getAllLevels(function (data) {
                $scope.levels = data;
            });
            commonService.getAllDepartmentes(function (data) {
                $scope.departments = data;
            });
            commonService.getAllTopics(function (data) {
                $scope.topics = data;
            });
            //获取所有的题目信息
            subjectService.getAllSubjects($routeParams,function (data) {
                data.forEach(function (subject) {
                    var answer = [];
                    //为每个选项添加编号 A B C D
                    subject.choices.forEach(function (choice,index) {
                        choice.no = commonService.convertIndexToNo(index);
                    });
                    //当当前题目类型为单选或者多选的时候，修改subject  answer
                    if(subject.subjectType){
                        if(subject.subjectType.id != 3){
                            subject.choices.forEach(function (choice) {
                                if(choice.correct){
                                    answer.push(choice.no);
                                }
                            });
                            //修改当前题目的answer
                            subject.answer = answer.toString();
                        }
                    }
                });

                $scope.subjects = data;
            });

        }])
    .service("subjectService",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
        this.checkSubject=function(id,state,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    'subject.id':id,
                    'subject.checkState':state
                }
            }).success(function (data) {
                handler(data);
            });
        };
        this.delSubject=function (id,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                'subject.id':id
                }
            }).success(function (data) {
                handler(data);
            });
        };
        this.saveSubject=function(params,handler){
            //处理数据
            var obj = {};
            for(var key in params){
                var val = params[key];
                switch (key){
                    case "typeId":
                        obj['subject.subjectType.id'] = val;
                        break;
                    case "levelId":
                        obj['subject.subjectLevel.id'] = val;
                        break;
                    case "departmentId":
                        obj['subject.department.id'] = val;
                        break;
                    case "topicId":
                        obj['subject.topic.id'] = val;
                        break;
                    case "stem":
                        obj['subject.stem'] = val;
                        break;
                    case "fx":
                        obj['subject.analysis'] = val;
                        break;
                    case "answer":
                        obj['subject.answer'] = val;
                        break;
                    case "choiceContent":
                        obj['choiceContent'] = val;
                        break;
                    case "choiceCorrect":
                        obj['choiceCorrect'] = val;
                        break;
                }
            }
            //对obj对象进行表单格式的序列化操作（默认为json）
            obj=$httpParamSerializer(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",obj,{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            }).success(function (data) {
                    handler(data);
                });
        };
        //获取所有题目信息
        this.getAllSubjects = function (params,handler) {
            var data={};
            //循环遍历将data转换为后台能够识别的筛选对象
            for(var key in params){
                var val = params[key];
                //只有当val不等于0的时候，才设置筛选属性
                if(val!=0){
                    switch(key){
                        case "a":
                            data['subject.subjectType.id']=val;
                            break;
                        case "b":
                            data['subject.subjectLevel.id']=val;
                            break;
                        case "c":
                            data['subject.department.id']=val;
                            break;
                        case "d":
                            data['subject.topic.id']=val;
                            break;
                    }
                }
            }
            /*$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{
                params:data
            }).success(function (data) {*/
            $http.get("data/subjects.json").success(function (data) {
                handler(data);
            });
        };
    }])
    .factory("commonService",["$http",function ($http) {
        return {
            //通过index(0 1 2 3 )获取所对应的序号(A B C D)
            convertIndexToNo:function(index){
                return index==0?'A':(index==1?'B':(index==2?'C':(index==3?'D':'E')));
            },
            getAllTypes : function (handler) {
                $http.get("data/Types.json").success(function (data) {
                // $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function (data) {
                    handler(data);
                });
            },
            getAllLevels : function (handler) {
                $http.get("data/Levels.json").success(function (data) {
                // $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
                    handler(data);
                });
            },
            getAllDepartmentes : function (handler) {
                $http.get("data/Departmentes.json").success(function (data) {
                // $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function (data) {
                    handler(data);
                });
            },
            getAllTopics : function (handler) {
                $http.get("data/Topics.json").success(function (data) {
                // $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function (data) {
                    handler(data);
                });
            }
        };
    }])
    //自定义过滤器
    .filter("selectTopics",function () {
        return function (input,id) {
            //input要过滤的值 ID为方向
            //console.log(input,id);
            //当input存在时，因为过滤器多次执行，前几次执行时input有可能不存在
            if(input){
                //Array.prototype中的filter方法
                var result=input.filter(function (item) {
                    //所属知识点数据中的department.id属性值等于动态获取到的方向的ID
                    return item.department.id==id;
                });
                //将过滤后的内容返回
                return result;
                //此时当选择Java时所属的知识点没有ID为1的知识点所以下拉框中第一个为空值绑定不上
            }
        }
    })
    //绑定事件时不允许在控制器里处理dom元素，dom操作时要用到自定义指令
    .directive("selectOption",function () {
        return {
            restrict:'A',
            link:function(scope,element){
                //element当前绑定的是当前元素为jQuery元素可以绑定事件
                //此时改变scope时也会映射到$scope中
                //console.log(scope.subject.choiceContent);//空的
                element.on("change",function () {
                    //当前元素的type属性明确当前为什么按钮
                    var type=$(this).attr("type");
                    //当前元素的val值
                    var val=$(this).val();
                    //判断当前元素是否被选中
                    var isCheck=$(this).prop("checked");
                    //选择题时要保证name值相同
                    if(type=='radio'){
                        //动态获取选项个数
                        var length=$("input[type='radio']").length;
                        //每次点击时会初始化
                        scope.subject.choiceCorrect=[false,false,false,false];
                        //当相等时添加答案
                        for(var i=0;i<length;i++){
                            if(i==val){
                                //scope.subject.choiceCorrect.push(true);//此时会无限往数组里添加
                                scope.subject.choiceCorrect[i]=true;
                            }
                        }
                    }else if(type=='checkbox'){
                        var length=$("input[type='checkbox']").length;
                        for(var i=0;i<length;i++){
                            if(i==val){
                                if(isCheck){
                                    scope.subject.choiceCorrect[i]=true;
                                }else{
                                    scope.subject.choiceCorrect[i]=false;
                                }

                            }
                        }
                    }
                    //强制消化
                    scope.$digest();
                });

            }

        }
    });
