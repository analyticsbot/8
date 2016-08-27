(function(angular){"use strict";var odesk=angular.module("uiApplet",["ngRoute","ngResource","ngSanitize","myApp.controllers","myApp.directives","myApp.filters","myApp.services","ui.bootstrap","ui.bootstrap.popover","components.core.config","components.core.fields.input","components.core.jobsuccess","components.core.log","components.core.modal","components.core.navigation","components.core.popover","components.core.rating","components.core.smf","components.core.templates","components.core.time"]);odesk.config(["SMF_CONFIG","$httpProvider",function(SMF_CONFIG,$httpProvider){SMF_CONFIG.group="jobs";SMF_CONFIG.page="show";$httpProvider.defaults.headers.common["X-Requested-With"]="XMLHttpRequest"}])})(angular);
(function(angular){"use strict";var epitomeCache={},skillsCache={},jobsProviderActionCtrl,data={},partials="/job-details/bundles/odeskjobdetails/partials/";angular.module("myApp.controllers",[]).controller("JobDetailsRootController",["$scope","SMF_CONFIG","oSmfServices",function($scope,SMF_CONFIG,oSmfServices){$scope.data=data;oSmfServices.retrieve(angular.extend({},SMF_CONFIG,{location:"custom"})).$promise.then(function(data){angular.forEach(data,function(smf){if(smf.title==="subscriptionTooltip"){$scope.data.showSubscriptionTooltip=true;oSmfServices.dismiss({id:smf.id})}})})}]).controller("ConnectsPopoverController",["$scope",function($scope){$scope.data=data;$scope.close=function(){$scope.data.showSubscriptionTooltip=false}}]).controller("JobDetailsOtherOpenJobsController",["$scope","baseUri","otherJobs",function($scope,baseUri,otherJobs){$scope.jobsCount=otherJobs.length;$scope.shownJobs=[];$scope.baseUri=baseUri;$scope.openJobs=otherJobs;$scope.showMore=function(){$scope.shownJobs=$scope.shownJobs.concat($scope.openJobs.splice(0,5))};$scope.showMore()}]).controller("JobDetailsSimilarJobsController",["$scope","baseUri","similarJobs",function($scope,baseUri,similarJobs){$scope.jobs=similarJobs;$scope.baseUri=baseUri}]).controller("JobDetailsApplicantsController",["$scope","applicantsService",function($scope,applicantsService){$scope.showedApplicants=[];$scope.applicants=[];$scope.bidStats=null;$scope.applicantsCount=0;$scope.loading=true;$scope.showApplicantsBlock=false;$scope.init=function(ciphertext){applicantsService(ciphertext).success(function(data){$scope.loading=false;$scope.applicantsCount=data.applicants.length;$scope.bidStats=data.applicantsBidsStats;$scope.applicants=data.applicants;$scope.data.applicantsCount=$scope.applicantsCount;if($scope.applicantsCount>0){$scope.showApplicantsBlock=true;$scope.showMore()}})};$scope.showMore=function(){$scope.showedApplicants=$scope.showedApplicants.concat($scope.applicants.splice(0,5))}}]).controller("JobDetailsControlPanelController",["$scope","eoModal",function($scope,eoModal){$scope.showConfirmModal=function(){eoModal.custom({controller:"JobDetailsCloseJobModalController",templateUrl:partials+"closejobpopup.html"});return false};var hash=window.location.hash;if(hash==="#closeJob"||hash==="#/closeJob"){$scope.showConfirmModal()}}]).controller("JobDetailsCloseJobModalController",["$scope","openingCiphertext","openingUrl","openingTeamId","hiredDevelopers","closeReasons","closeJobUrl","$modalInstance",function($scope,openingCiphertext,openingUrl,openingTeamId,hiredDevelopers,closeReasons,closeJobUrl,$modalInstance){$scope.reasons=closeReasons;$scope.reason="";$scope.needReason=!hiredDevelopers;$scope.modal=$modalInstance;$scope.url=openingUrl;$scope.ciphertext=openingCiphertext;$scope.openingTeamId=openingTeamId;$scope.closeJobUrl=closeJobUrl;$scope.token=Applet.getVar("CsrfUserSiteToken")}]).controller("JobDetailsApplicantLoaderController",["$scope","$http","$compile",function($scope,$http,$compile){$scope.engagement=$scope.$parent.$parent.$parent.$parent;if($scope.engagement.applicant){$scope.userKey=$scope.engagement.applicant.applicantProfileCiphertext}if($scope.engagement.job){$scope.userKey=$scope.engagement.job.contractorInfo.ciphertext}if(!epitomeCache[$scope.userKey]){$scope.epitome="Loading...";$http.get("/jobs/epitome/"+$scope.userKey).success(function(content){$scope.epitome=content;$scope.loading=false;epitomeCache[$scope.userKey]=content}).error(function(){$scope.epitome="Error occurred";$scope.loading=false})}else{$scope.epitome=epitomeCache[$scope.userKey];$scope.loading=false}}]).controller("JobDetailsFlaggingPopupController",["$scope","flaggingReasons","flaggingStates",function($scope,flaggingReasons,flaggingStates){$scope.reasons=flaggingReasons;$scope.reasons.map(function(reason){reason.model=flaggingStates[reason.rid]>0});$scope.error=false;$scope.submit=function(){$scope.$root.$broadcast("submitFlag",{reasons:$scope.reasons})};$scope.cancel=function(){$scope.$parent.$parent.isOpen=false};$scope.$on("flagSubmitted",function(){$scope.cancel()});$scope.$on("flagError",function(){$scope.error=true})}]).controller("JobDetailsFlaggingController",["$scope","openingId","flaggingService",function($scope,openingId,flaggingService){$scope.success=false;$scope.$on("submitFlag",function(event,args){flaggingService(openingId,args.reasons).success(function(){$scope.success=true;$scope.$root.$broadcast("flagSubmitted")}).error(function(){$scope.$root.$broadcast("flagError")})})}]).controller("JobDetailsBidRangeController",["$scope",function($scope){$scope.membershipChangePlanReturnUrl=btoa(JSON.stringify({success:window.location.href,back:window.location.href,competitivePricing:1}));$scope.isPopoverOpen=false;$scope.close=function(event){$scope.isPopoverOpen=false;if(event){event.stopPropagation();event.preventDefault()}}}]).controller("JobDetailsSkills",["$scope",function($scope){$scope.skill=$scope.$parent.$parent.$parent.$parent.skill;$scope.getDomainFromUrl=function(url){var re=new RegExp("\\://([^/]+)","i");if(!re.test(url)){return false}var domain=url.match(re)[1].toString();var firstIndex=domain.indexOf(".");if(firstIndex>0){var lastIndex=domain.lastIndexOf(".");if(firstIndex<lastIndex){var distance=domain.length-1-lastIndex;var lastLocation=domain.lastIndexOf(".",lastIndex-1);var subStart=distance===3?lastLocation:domain.lastIndexOf(".",lastLocation-1);return domain.substr(subStart+1)}}};$scope.skill.domain=$scope.getDomainFromUrl($scope.skill.externalLink)}]).controller("JobDetailsHistoryController",["$scope","workHistory",function($scope,workHistory){$scope.historyLength=workHistory.length;$scope.shownHistory=[];$scope.jobsInProgress=[];$scope.history=[];$scope.showMore=function(){$scope.shownHistory=$scope.shownHistory.concat($scope.history.splice(0,5))};angular.forEach(workHistory,function(job){job.isEDCPublic=true;if(job.isEDCReplicated&&job.jobInfo.title===null){job.isEDCPublic=false;job.jobInfo.title="Private";job.contractorInfo.contractorName="Private"}if(!job.endDate){$scope.jobsInProgress.push(job)}else{$scope.history.push(job)}});$scope.showMore()}]).controller("GroupPopoverController",["$scope",function($scope){$scope.group=data.group}]).controller("SkillsPopoverController",["$scope",function($scope){$scope.skills=[]}]).controller("JobsProviderActionPopoverController",["$scope","minRateToApply",function($scope,minRateToApply){$scope.minRate=minRateToApply}]).controller("VisitorApplyBtnsCntrl",["$scope","oLog","$window","eoModelFactory",function($scope,oLog,$window,eoModelFactory){$scope.logEvent=function(event){event.preventDefault();event.stopPropagation();oLog.event(eoModelFactory.get("Event",{event:"click",location:"jobdetails_page",sublocation:"signup_link",data:[{pageversion:"visitor_site",timestamp:Date.now()}]})).then(function(){$window.location.href=event.target.href},function(){$window.location.href=event.target.href})}}]).controller("JobsProviderActionController",["$scope","$http","eoModal","$timeout","minRateToApply","oLog","eoModelFactory","$window","eoConfig","connectsData","openingCiphertext",function($scope,$http,eoModal,$timeout,minRateToApply,oLog,eoModelFactory,$window,eoConfig,connectsData,openingCiphertext){var _verification;$scope.init=function(verification){_verification=verification;$scope.updateJobSavedStatus()};$scope.isActive=false;$scope.isSavedKnown=false;jobsProviderActionCtrl=this;jobsProviderActionCtrl.isJobSaved=function(){return $scope.isActive};$scope.$on("saveForLater",function(event,args){$scope.saveJobClick()});$scope.$watch("openingRef",function(openingRef){$scope.openingRef=openingRef},true);$scope.$watch("isActive",function(){$scope.saveJobLinkTitle=$scope.isActive?"Saved":"Save Job";$scope.saveJobHeartBeatOn=$scope.isActive},true);$scope.updateJobSavedStatus=function(){$http({method:"GET",url:"/jobs/"+openingCiphertext+"/is-saved"}).success(function(data,status,headers,config){$scope.isActive=data.isJobSaved;$scope.isSavedKnown=true}).error(function(data,status,headers,config){$scope.isActive=false;$scope.isSavedKnown=true})};var _logEvent=function(sublocation){return oLog.event(eoModelFactory.get("Event",{event:"click",location:"jobdetails_page",sublocation:sublocation,data:[{pageversion:"user_site",timestamp:Date.now(),type:"opening",id:openingCiphertext}]}),{proxy:"/event-log/proxy-decrypt-opening-ciphertext"})};$scope.logEvent=function(event,sublocation){event.preventDefault();event.stopPropagation();_logEvent(sublocation).then(function(){$window.location.href=event.target.href},function(){$window.location.href=event.target.href})};$scope.saveJobClick=function(){$http({method:"GET",url:"/fwh-api/save-job/",params:{key:$scope.openingRef,undo:$scope.isActive?1:0}}).success(function(data,status,headers,config){return true}).error(function(data,status,headers,config){$scope.warningModal=eoModal.custom({templateUrl:partials+"save-job-ajax-fail-modal.html"});$timeout(function(){$scope.warningModal.close();$scope.isActive=!$scope.isActive},5e3)});$scope.isActive=!$scope.isActive};$scope.showVerification=function($event){if(_verification.messageType=="needed"){eoModal.custom({controller:"JobDetailsVerificationNeededPopupController",templateUrl:partials+_verification.messageString,locals:{profileUnderReview:_verification.profileUnderReview}})}if(_verification.messageType=="submitted"){eoModal.custom({controller:"JobDetailsUnderReviewPopupController",templateUrl:partials+"verification-under-review-popup.html",locals:{customData:{idvStatus:_verification.messageString,profileUnderReview:_verification.profileUnderReview}}});return false}if(_verification.messageType=="hardreject"){eoModal.custom({controller:"JobDetailsUnderReviewPopupController",templateUrl:partials+"verification-hardreject-popup.html",locals:{customData:{message:_verification.messageString}}})}if(_verification.messageType=="softreject"){eoModal.custom({controller:"JobDetailsUnderReviewPopupController",templateUrl:partials+"verification-softreject-popup.html",locals:{customData:{message:_verification.messageString}}})}};$scope.clickApplyButton=function($event){if(_verification.preventApply){$scope.showVerification($event);return}if(connectsData.connectsForApply){var connectsForApply=connectsData.connectsForApply;if(connectsForApply.ic&&(connectsForApply.ic.jobsPrice!=0||connectsData.pricesDifferent)){eoModal.custom({controller:"JobDetailsSelectTeamController",templateUrl:partials+"select-team-popup.html"});_logEvent("apply_button");return false}if(!connectsData.isContextAdmin&&!connectsForApply.canAddACs){eoModal.simple({templateUrl:partials+"not-subscribed-agency-popup.html"});_logEvent("apply_button");return false}if(!connectsData.isContextAdmin&&connectsForApply.connects<connectsForApply.jobsPrice){eoModal.simple({templateUrl:partials+"not-enough-connects-popup.html"});_logEvent("apply_button");return false}}_logEvent("apply_button").then(function(){window.location.href="/job/"+openingCiphertext+"/apply/"},function(){window.location.href="/job/"+openingCiphertext+"/apply/"})}}]).controller("JobDetailsVerificationNeededPopupController",["$scope","$modalInstance","eoModal","openingCiphertext","profileUnderReview",function($scope,$modalInstance,eoModal,openingCiphertext,profileUnderReview){$scope.modal=$modalInstance;$scope.profileUnderReview=profileUnderReview;$scope.close=function(){$modalInstance.close({success:true})};$scope.startVerification=function(){window.location.href="/UserSettings/verify-phone/?key="+openingCiphertext+"&from=apply"}}]).controller("JobDetailsUnderReviewPopupController",["$scope","$modalInstance","eoModal","openingCiphertext","customData",function($scope,$modalInstance,eoModal,openingCiphertext,customData){$scope.modal=$modalInstance;$scope.message=customData.message;$scope.idvStatus=customData.idvStatus;$scope.profileUnderReview=customData.profileUnderReview;$scope.close=function(){$modalInstance.close({success:true})};$scope.isJobSaved=jobsProviderActionCtrl.isJobSaved();$scope.saveForLater=function(){$scope.$root.$broadcast("saveForLater");$modalInstance.close({success:true})};$scope.startVerification=function(){window.location.href="/UserSettings/verify-phone/?key="+openingCiphertext+"&from=apply"}}]).controller("JobDetailsSelectTeamDialogController",["$scope","$modalInstance","_customInjectable",function($scope,$modalInstance,_customInjectable){$scope.hasBack=_customInjectable.hasBack;$scope.ok=function(){$modalInstance.close(true)};$scope.cancel=function(){$modalInstance.dismiss("cancel")}}]).controller("JobDetailsSelectTeamController",["$scope","$modalInstance","eoModal","connectsData","openingCiphertext",function($scope,$modalInstance,eoModal,connectsData,openingCiphertext){$scope.modal=$modalInstance;$scope.connectsData=connectsData;$scope.close=function(){$modalInstance.close({success:true})};$scope.continue=function(){$modalInstance.close({success:true});if($scope.applyAs!=="ic"){var i,item,connects=connectsData.connectsForApply.ac;for(i=0;i<connects.length;i++){if(connects[i].agencyRecno==$scope.applyAs){item=connects[i];break}}if(!item.isContextAdmin&&(!item.canAddACs||item.connects<item.jobsPrice)){var template=!item.canAddACs?"not-subscribed-agency-popup.html":"not-enough-connects-ac-popup.html";eoModal.custom({controller:"JobDetailsSelectTeamDialogController",templateUrl:partials+template,locals:{_customInjectable:{hasBack:true}}}).result.then(function(result){},function(){eoModal.custom({controller:"JobDetailsSelectTeamController",templateUrl:partials+"select-team-popup.html"})});return}}window.location.href="/job/"+openingCiphertext+"/apply/"+$scope.applyAs}}])})(angular);
(function(angular){"use strict";angular.module("myApp.filters",["myApp.services"]).filter("url_filter",function(){return function(input,title,ciphertext,baseUri){baseUri=baseUri||"";var words=title.match(/[\w]{3,}/g);if(words&&!odesk.isVisitor){return baseUri+words.join("-")+"_"+ciphertext}else if(odesk.isVisitor){return baseUri+"_"+ciphertext+"/"}return baseUri+ciphertext}}).filter("trust_html",["$sce",function($sce){return function(htmlCode){return $sce.trustAsHtml(htmlCode)}}]).filter("truncate",function(){return function(value,wordwise,max,tail){if(!value)return"";max=parseInt(max,10);if(!max)return value;if(value.length<=max)return value;value=value.substr(0,max);if(wordwise){var lastspace=value.lastIndexOf(" ");if(lastspace!=-1){value=value.substr(0,lastspace)}}return value+(tail||" …")}})})(angular);
(function(angular){"use strict";angular.module("myApp.directives",["myApp.services","components.core.popover"]).directive("appVersion",["version",function(version){return function(scope,element,attrs){element.text(version)}}]).directive("dynamic",function($compile){return{restrict:"A",replace:true,link:function(scope,ele,attrs){scope.$watch(attrs.dynamic,function(html){ele.html(html);setTimeout(function(){$compile(ele.contents())(scope)})})}}}).directive("jpTruncatable",function($filter){var truncateFilter=$filter("truncate");var link=function(scope,element,attrs){var originalText=attrs.jpTruncatable;var truncateTo=attrs.jpTruncatableTo||150;scope.text=truncateFilter(originalText,true,truncateTo," ...");scope.needTruncate=originalText.length>truncateTo;scope.toggleTitle="More";scope.truncated=true;scope.toggleTruncate=function(){if(scope.truncated){scope.text=originalText;scope.toggleTitle="Less"}else{scope.text=truncateFilter(originalText,true,truncateTo," ...");scope.toggleTitle="More"}scope.truncated=!scope.truncated}};return{restrict:"A",link:link,scope:{},template:'{{text}} <a ng-click="toggleTruncate()" ng-show="needTruncate">{{toggleTitle}}</a>'}})})(angular);
(function(angular){"use strict";angular.module("myApp.services",[]).factory("flaggingService",function($http){return function(openingId,reasons){var settedIds=[],unsettedIds=[];angular.forEach(reasons,function(value){(value.model?settedIds:unsettedIds).push(value.rid)});return $http({method:"POST",url:"/api/hr/v1/flagging.json",headers:{"Content-Type":"application/x-www-form-urlencoded","X-Odesk-Csrf-Token":Applet.getVar("CsrfUserSiteToken"),"X-Odesk-User-Agent":"oDesk CI"},data:{flagged_item:"user",http_method:"put",func:"toggleFlag",type_id:settedIds,unset_type_id:unsettedIds,flagged_subitem:"opening",flagged_subitem_id:openingId},transformRequest:function(obj){var str=[];angular.forEach(obj,function(value,key){if(angular.isArray(value)){value.map(function(valueItem){str.push(encodeURIComponent(key)+"[]="+encodeURIComponent(valueItem))})}else{str.push(encodeURIComponent(key)+"="+encodeURIComponent(value))}});return str.join("&")}})}}).factory("applicantsService",function($http){return function(ciphertext){return $http({method:"GET",url:"/jobs/"+ciphertext+"/applicants"})}})})(angular);