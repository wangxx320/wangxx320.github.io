/**
 * Created by Administrator on 2016/9/28.
 * 试卷模块
 * 不能添加未审核和不通过的题目（过滤器）
 * 添加过的题目不能重复添加并且不会出现或消失
 *
 */
angular.module("app.paper",["ng","app.subject"])
    //列表控制器
    //使用app.subject模块中的commonService服务
    //$routeParams中可以存放用户选中的值
    .controller("paperAddController",["$scope","commonService","$routeParams","paperModel","paperService",function ($scope,commonService,$routeParams,paperModel,paperService) {
        commonService.getAllDepartmentes(function (data) {
            //将全部方向绑定到作用域的dps中
            $scope.dps=data;
        });
        //双向绑定的模板
        $scope.pmodel=paperModel.model;
        var subjectId=$routeParams.id;
        //当题目的ID不为0时添加题目ID
        if(subjectId!=0){
            paperModel.addSubjectId(subjectId);
            //$routeParams单例  添加时不能遍历两次一样的对象所以要使用copy方法
            //paperModel.addSubject($routeParams);
            paperModel.addSubject(angular.copy($routeParams));
        }
        $scope.savePaper=function () {
            paperService.savePaper($scope.pmodel,function (data) {
                alert(data);
            });
        };
    }])
    //添加控制器
    .controller("paperListController",["$scope",function ($scope) {

    }])
    //删除控制器
    .controller("paperDelController",["$scope",function ($scope) {

    }])
    .factory("paperService",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
        return{
            savePaper:function (params,handler) {
                var obj={};
                for(var key in params){
                    var val = params[key];
                    switch (key){
                        case "departmentId":
                            obj['paper.department.id'] = val;
                            break;
                        case "title":
                            obj['paper.title'] = val;
                            break;
                        case "desc":
                            obj['paper.description'] = val;
                            break;
                        case "at":
                            obj['paper.answerQuestionTime'] = val;
                            break;
                        case "total":
                            obj['paper.totalPoints'] = val;
                            break;
                        case "scores":
                            obj['scores'] = val;
                            break;
                        case "subjectIds":
                            obj['subjectIds'] = val;
                            break;
                    }
                }
                obj=$httpParamSerializer(obj);
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",obj,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                    handler(data);
                });
            }
        };
    }])
    .factory("paperModel",function () {
        return{
            //延迟加载   后台数据
            //模板服务有单例的特性，当重新加载此页面时，可以保留之前页面的对象信息
            model:{
                departmentId:1, //方向ID
                title:"",       //标题
                desc:"",        //描述
                at:0,           //时间
                total:0,        //总分
                scores:[],      //题目的分值
                subjectIds:[],   //题目的ID
                subjects:[]
            },
            //为模板subjectIds数组添加题目的ID
            addSubjectId:function (id) {
                this.model.subjectIds.push(id);
            },
            addSubject:function (subject) {
                this.model.subjects.push(subject);
            }
        };
    });