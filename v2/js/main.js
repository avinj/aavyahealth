$(document).ready(function() {

	// Update slider value in associated text box when changed and re-calculate risk
	$("button, input").on("click change", function(){
		if($(this).is('button')) {
			bID = $(this).prop('id');
			yesNoIDs = ["diabetic","smoker","hypertension"];
			if(bID == "gender") {
				$(this).val() == "0" ? $(this).val("1").text("Female") : $(this).val("0").text("Male");
			} else if (yesNoIDs.indexOf(bID) != -1) {
				$(this).val() == "1" ? $(this).val("0").text("No") : $(this).val("1").text("Yes");
			}
		} else {
			$("#"+$(this).prop("id")+"-stats").text($(this).val());
		}

		//product categories and risk counts open
		var pOpen = 0, riskCount = 0;
		var origSide = 30; //for risk %, use 30
		var bubbleScale = 0.15; //for risk %, use 0.15
		var riskObject = {};
		var heartObject = {};

		// re-calculate actual risk
		var modelType = ($("#total-cholesterol").val() == "50" && $("#ldl-cholesterol").val() == "60" && $("#hdl-cholesterol").val() == "10") ? "BMI" : "LIPID";
		var newRisk = framingham.calcRisk(modelType);
		var newHeartAge = framingham.calcHeartAge(newRisk, modelType); 
		//$(".risk-percent, #risk-announce-val").text(newRisk+"%");
		$(".risk-percent, #risk-announce-val").text(newHeartAge);

		//hide or show risk section based on actual risk score
		(!isNaN(newRisk) && newRisk > 0) ? $("#risk-container").slideDown("slow") : $("#risk-container").slideUp("slow"); 

		//slide out cholesterol products and recommendations based on risk
		if($("#total-cholesterol").val() >= 200) {
			var lowCholRisk = framingham.calcRisk(modelType,["tcl"]);
			var lowCholHeartAge = framingham.calcHeartAge(lowCholRisk, modelType);
			$(".chol-product").slideDown(500, "linear");
			//$("#chol-risk-percent").text(lowCholRisk+"%");
			$("#chol-risk-percent").text(lowCholHeartAge);
			$("#risk-chol").fadeIn("slow");
			lowCholRisk = Math.round(1000 * lowCholRisk)/10
			riskObject["#chol-risk-bubble"] = [Math.max(origSide,origSide*lowCholRisk*bubbleScale), lowCholRisk];
			heartObject["#chol-risk-bubble"] = [Math.max(origSide,origSide*lowCholHeartAge*bubbleScale), lowCholHeartAge];
			pOpen += 1;
			riskCount += 1;
		} else {
			$(".chol-product").slideUp("fast");
			$("#risk-chol").fadeOut(0);
		} 

		//slide out diets based on bp
		$("#blood").val() > 135 ? $("#diet").slideDown(500, "linear") : $("#diet").slideUp(500, "linear");

		//slide out smoking products and recommendations based on risk
		if($("#smoker").val() == "1") {
			var notSmokeRisk = framingham.calcRisk(modelType,["smoker"]);
			var notSmokeHeartAge = framingham.calcHeartAge(notSmokeRisk, modelType);
			$(".smoke-product").slideDown(500, "linear");
			//$("#smoke-risk-percent").text(notSmokeRisk+"%");
			$("#smoke-risk-percent").text(notSmokeHeartAge);
			$("#risk-smoke").fadeIn("slow");
			notSmokeRisk = Math.round(1000 * notSmokeRisk)/10
			riskObject["#smoke-risk-bubble"] = [Math.max(origSide,origSide*notSmokeRisk*bubbleScale), notSmokeRisk];
			heartObject["#smoke-risk-bubble"] = [Math.max(origSide,origSide*notSmokeHeartAge*bubbleScale), notSmokeHeartAge];
			pOpen += 1;
			riskCount += 1;
		} else { 
			$(".smoke-product").slideUp("fast");
			$("#risk-smoke").fadeOut(0);
		}

		//hide products header if nothing to see
		pOpen > 0 ? $("#all-products").slideDown(250,"linear") : $("#all-products").slideUp("fast"); 

		// if blood pressure >+ 130, determine risk if lower bp to 120
		if($("#blood").val() > 130) {
			var lowBpRisk = framingham.calcRisk(modelType,["blood"]);
			var lowBpHeartAge = framingham.calcHeartAge(lowBpRisk, modelType);
			//$("#bp-risk-percent").text(lowBpRisk+"%");
			$("#bp-risk-percent").text(lowBpHeartAge);
			$("#risk-blood").fadeIn("slow");
			lowBpRisk = Math.round(1000 * lowBpRisk)/10
			riskObject["#bp-risk-bubble"] = [Math.max(origSide,origSide*lowBpRisk*bubbleScale), lowBpRisk];
			heartObject["#bp-risk-bubble"] = [Math.max(origSide,origSide*lowBpHeartAge*bubbleScale), lowBpHeartAge];
			riskCount += 1;
		} else {
			$("#risk-blood").fadeOut(0);
		}
		
		// if all risks out, show collective decrease of risk
		if(riskCount == 3) {
			var allRisk = framingham.calcRisk(modelType,["smoker","tc","blood"]);
			var allHeartAge = framingham.calcHeartAge(allRisk, modelType);
			//$("#all-risk-percent").text(allRisk+"%");
			$("#all-risk-percent").text(allHeartAge);
			$("#risk-all").fadeIn("slow");
			allRisk = Math.round(1000 * allRisk)/10
			riskObject["#all-risk-bubble"] = [Math.max(origSide,origSide*allRisk*bubbleScale), allRisk];
			heartObject["#all-risk-bubble"] = [Math.max(origSide,origSide*allHeartAge*bubbleScale), allHeartAge];
			riskCount += 1;
		} else {
			$("#risk-all").fadeOut(0);
		}

		// rearrange column spacing based on number visible
		if(screen.width > 720) {
			$.each($('.risk:visible'), function(){
				$(this).css("width", riskCount < 4 ? riskCount == 1 ? "920px" : 900/riskCount+"px" : "");
			});
		} else if(screen.width < 450) {
			$.each($('.risk:visible'), function(){
				$(this).css("width", "280px");
			});
		}

		//modify risk bubble scales and color depending on risk
		newRisk = Math.round(1000 * newRisk)/10;
		riskObject["#main-risk-bubble"] = [Math.max(origSide,origSide*newRisk*bubbleScale), newRisk];
		heartObject["#main-risk-bubble"] = [Math.max(origSide,origSide*newHeartAge*bubbleScale), newHeartAge];

		
		for (obj in riskObject) {
			if (obj == "#main-risk-bubble") {
				$(obj).css("width",Math.min(180,riskObject[obj][0])+"px").css("height",Math.min(180,riskObject[obj][0])+"px").css("background-color", riskObject[obj][1] > 25 ? "rgba(218, 60, 38, 0.65098)" : riskObject[obj][1] > 15 ? "rgba(253, 189, 18, 0.65098)" : "rgba(114, 193, 176, 0.65098)");

			} else {
				$(obj).css("width",Math.min(180,(riskObject[obj][1]/riskObject["#main-risk-bubble"][1])*riskObject[obj][0])+"px").css("height",Math.min(180,(riskObject[obj][1]/riskObject["#main-risk-bubble"][1])*riskObject[obj][0])+"px").css("background-color", riskObject[obj][1] >= 25 ? "rgba(218, 60, 38, 0.65098)" : riskObject[obj][1] > 15 ? "rgba(253, 189, 18, 0.65098)" : "rgba(114, 193, 176, 0.65098)");

			}
		}

		/*for (obj in heartObject) {
			if (obj == "#main-risk-bubble") {
				$(obj).css("width",Math.min(180,heartObject[obj][0])+"px").css("height",Math.min(180,heartObject[obj][0])+"px").css("background-color", heartObject[obj][1] > 40 ? "rgba(218, 60, 38, 0.65098)" : heartObject[obj][1] > 30 ? "rgba(253, 189, 18, 0.65098)" : "rgba(114, 193, 176, 0.65098)");

			} else {
				$(obj).css("width",Math.min(180,(heartObject[obj][1]/heartObject["#main-risk-bubble"][1])*heartObject[obj][0])+"px").css("height",Math.min(180,(heartObject[obj][1]/heartObject["#main-risk-bubble"][1])*heartObject[obj][0])+"px").css("background-color", heartObject[obj][1] > 40 ? "rgba(218, 60, 38, 0.65098)" : heartObject[obj][1] > 30 ? "rgba(253, 189, 18, 0.65098)" : "rgba(114, 193, 176, 0.65098)");

			}
		}*/
			
	});

	// Delay visibility until loaded
	$("#age, #blood, #total-cholesterol, #ldl-cholesterol, #hdl-cholesterol").on("slider:ready", function(){ $(this).prop("opacity","1")});
});

// Framingham risk calculator
var framingham = {

	// Coefficients for BMI Calculation
	values: {
		"BMI": {
			"coefsMaleNoTrtbp": {"age": 3.11296, "sbp": 1.85508, "bmi": 0.79277, "smoker": 0.70953, "diabetes": 0.5316},
			"coefsFemaleNoTrtbp": {"age": 2.72107, "sbp": 2.81291, "bmi": 0.51125, "smoker": 0.61868, "diabetes": 0.77763},
			"coefSbpMaleTrtbp": 1.92672,
			"coefSbpFemaleTrtbp": 2.88267,
			"useLogData": {"age": true, "sbp": true, "bmi": true, "smoker": false, "diabetes": false},
			"betaZeroMale": -23.9388,
			"betaZeroFemale": -26.0145,
			"baseMale": 0.88431,
			"baseFemale": 0.94833,
			"baselineNormalData": {"gender": 0,  "age": 30, "sbp": 125, "bmi": 22.5, "smoker": 0, "diabetes": 0, "trtbp": 0}		
		},
		"LIPID": {
			"coefsMaleNoTrtbp": {"age": 3.06117, "sbp": 1.93303, "tcl": 1.1237, "hdl": -0.93263, "smoker": 0.65451, "diabetes": 0.57367},
			"coefsFemaleNoTrtbp": {"age": 2.32888, "sbp": 2.76157, "tcl": 1.20904, "hdl": -0.70833, "smoker": 0.52873, "diabetes": 0.69154},
			"coefSbpMaleTrtbp": 1.99881,
			"coefSbpFemaleTrtbp": 2.82263,
			"useLogData": {"age": true, "sbp": true, "tcl": true, "hdl": true, "smoker": false, "diabetes": false},
			"betaZeroMale": -23.9802,
			"betaZeroFemale": -26.1931,
			"baseMale": 0.88936,
			"baseFemale": 0.95012,
			"baselineNormalData": {"gender": 0, "age": 30, "sbp": 125, "tcl": 180, "hdl": 45, "smoker": 0, "diabetes": 0, "trtbp": 0}
		}
	},

	// BMI Calculation
	calcBMI: function(height,mass) { //height in inches, weight in lbs
		return 703.0814062 * mass / (height * height)
	},

	calcRisk: function(calcType, overrides){
		var coefs, base, betaZero, cData, cBMI, sex;

		sex = $("#gender").val() == 0 ? "Male" : "Female";

		betaZero = framingham.values[calcType]["betaZero"+sex];
		base = framingham.values[calcType]["base"+sex];
		coefs = $.extend(true, {}, framingham.values[calcType]["coefs"+sex+"NoTrtbp"]);
		if($("#hypertension").val() == 1)
			coefs["sbp"] = framingham.values[calcType]["coefSbp"+sex+"Trtbp"];

		cBMI = framingham.calcBMI(parseInt($("#height-feet").val())*12+parseInt($("#height-inches").val()),$("#weight").val());
		cData = {"age":$("#age").val(), "sbp":$("#blood").val(), "diabetes":$("#diabetic").val(), "smoker":$("#smoker").val()};
		(calcType == "BMI" && !isNaN(cBMI) && cBMI > 0) ? cData["bmi"] = cBMI : (cData["tcl"] = $("#total-cholesterol").val(), cData["hdl"] = $("#hdl-cholesterol").val());

		//implement overrides if requested
		if($.inArray("smoker", overrides) != -1) 
			cData["smoker"] = 0;
		if($.inArray("tcl", overrides) != -1) 
			cData["tcl"] = 200;
		if($.inArray("blood", overrides) != -1) 
			cData["sbp"] = 120;
		if($.inArray("heartAge", overrides) != -1)
			cData = overrides[1]; //completely replace with passed array

		var betaSum = betaZero;

	    for(var k in coefs)
	    {
	    	var m = parseFloat(cData[k]);
	    	if (framingham.values[calcType]["useLogData"][k])
	    		m = Math.log(m);
	        var dBeta = coefs[k] * m;
	        betaSum += dBeta;
	    }
	
	    var risk =  1.0 - Math.pow(base, Math.exp(betaSum));

	    return risk;
	    //return Math.round(1000 * risk)/10;
	},

	calcHeartAge: function(riskVal, calcType) {
		var loAge = 10;
		var hiAge = 86;
		var testAge;
		var testRisk;

		var testData = $.extend(true, {}, framingham["values"][calcType]["baselineNormalData"]);
		testData['gender'] = $("#gender").val();

		while ((hiAge - loAge) > .2) {
			testAge = (hiAge + loAge) / 2.0;
			testData['age'] = testAge;

			overrides = ["heartAge",testData];

			testRisk  = framingham.calcRisk(calcType,overrides);

			if (testRisk < riskVal)
			{
				loAge = testAge;
			} else if (testRisk > riskVal) {
				hiAge = testAge;
			} else {
				hiAge = testAge;
				loAge = testAge;
			}
		}

		return Math.round(testAge);
	}	

};


//force default to full cart (manual)
var servingData = [{"id":"grains","group":"GRAINS","servings":[4,4],"maxservings":8,"text":"GOAL: 6-8"},
                {"id":"vegetables","group":"VEGETABLES","servings":[4,1],"maxservings":5,"text":"GOAL: 4-5"},
                {"id":"fruits","group":"FRUITS","servings":[4,1],"maxservings":5,"text":"GOAL: 4-5"},
                {"id":"dairy","group":"DAIRY","servings":[1,2],"maxservings":3,"text":"GOAL: 2-3"},
                {"id":"meat","group":"MEAT","servings":[1,5],"maxservings":6,"text":"GOAL: <6"},
                {"id":"nutslegumes","group":"NUTS/LEGUMES","servings":[1,4],"maxservings":5,"text":"GOAL: 4-5/WEEK"},
                {"id":"fatsoils","group":"FATS/OILS","servings":[0,3],"maxservings":3,"text":"GOAL: 2-3/WEEK"},
                {"id":"sweets","group":"SWEETS","servings":[1,4],"maxservings":5,"text":"GOAL: <5/WEEK"},
                {"id":"sodium","group":"SODIUM","servings":[415,1885],"maxservings":2300,"text":"GOAL: <2300 mg"}
               ];

//product json
var firstTime = 1; //hack - later perhaps start out with all items selected?
var productData = {
                    "steamfresh": {
                        "active": 0,
                        "info": {"grains":0,"vegetables":2,"fruits":0,"dairy":0,"meat":0,"nutslegumes":0,"fatsoils":0,"sweets":0,"sodium":0}
                    },
                   "freshexpress": {
                        "active": 0,
                        "info": {"grains":0,"vegetables":2,"fruits":0,"dairy":0,"meat":0,"nutslegumes":0,"fatsoils":0,"sweets":0,"sodium":0}
                    },
                   "barilla": {
                        "active": 0,
                        "info": {"grains":1,"vegetables":0,"fruits":0,"dairy":0,"meat":0,"nutslegumes":0,"fatsoils":0,"sweets":0,"sodium":0}
                    },
                   "cheerios": {
                        "active": 0,
                        "info": {"grains":1,"vegetables":0,"fruits":0,"dairy":0,"meat":0,"nutslegumes":0,"fatsoils":0,"sweets":0,"sodium":150}
                    },
                   "saralee": {
                        "active": 0,
                        "info": {"grains":2,"vegetables":0,"fruits":0,"dairy":0,"meat":0,"nutslegumes":0,"fatsoils":0,"sweets":0,"sodium":0}
                    },
                   "sunmaid": {
                        "active":0,
                        "info": {"grains":0,"vegetables":0,"fruits":2,"dairy":0,"meat":0,"nutslegumes":0,"fatsoils":0,"sweets":0,"sodium":0}
                    },
                   "bananas": {
                        "active":0,
                        "info": {"grains":0,"vegetables":0,"fruits":1,"dairy":0,"meat":0,"nutslegumes":0,"fatsoils":0,"sweets":0,"sodium":0}
                    },
                   "craisins": {
                        "active":0,
                        "info": {"grains":0,"vegetables":0,"fruits":1,"dairy":0,"meat":0,"nutslegumes":0,"fatsoils":0,"sweets":1,"sodium":0}
                    },
                   "planters": {
                        "active":0,
                        "info": {"grains":0,"vegetables":0,"fruits":0,"dairy":0,"meat":0,"nutslegumes":1,"fatsoils":0,"sweets":0,"sodium":100}
                    },
                   "chobani": {
                        "active":0,
                        "info": {"grains":0,"vegetables":0,"fruits":0,"dairy":1,"meat":0,"nutslegumes":0,"fatsoils":0,"sweets":0,"sodium":65}
                    },
                   "eggs": {
                        "active":0,
                        "info": {"grains":0,"vegetables":0,"fruits":0,"dairy":0,"meat":1,"nutslegumes":0,"fatsoils":0,"sweets":0,"sodium":100}
                    }
                 };

//prepare donuts
var width = 100,
    height = 120,
    radius = Math.min(width, height) / 2;

var arc = d3.svg.arc()
    .innerRadius(radius - 5)
    .outerRadius(radius - 20);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d; });

var svg = d3.select("#diet-charts").selectAll(".pie")
      .data(servingData)
    .enter().append("svg")
      .attr("class", "pie")
      .attr("id",function(d) {return d.group.toLowerCase().replace("/","")})
      .attr("width", width)
      .attr("height", function(d) {
        return d.id == "sodium" ? height*1.22 : height;
      })
    .append("g")
      .attr("transform", function(d) {
        return d.id == "sodium" ? "translate(" + width / 2 + "," + 1.25*(height / 2) + ")" : "translate(" + width / 2 + "," + height / 2 + ")";
      });

//FOOD GROUP LABEL
var foodGroupLabel = svg.append("svg:text")
      .attr("class", "diet-label")
      .attr("dy", -50)
      .attr("text-anchor", "middle") 
      .text(function(d) {return d.group;});

//RECOMMENDED SERVING
var reccServing = svg.append("svg:text")
     .attr("class", "serving-recc-label")
     .attr("dy", 58)
     .attr("text-anchor", "middle") 
     .text(function(d) {return d.text});

//GRAPH ARCS
var path = svg.selectAll(".arc")
      .data(function(d) { 
        return pie(d.servings); 
    })
    .enter().append("path")
      .attr("class","arc")
      .attr("fill", function(d, i) { 
        mygroup = this.parentElement.getElementsByClassName('diet-label')[0].textContent;
        if (mygroup == "MEAT" || mygroup == "NUTS/LEGUMES") {
            return i == 0 ? "gold" : "lightgoldenrodyellow";
        } else if (mygroup == "FATS/OILS" || mygroup == "SWEETS" || mygroup == "SODIUM") {
            return i == 0 ? "red" : "pink";
        } else {
            return i == 0 ? "green" : "lightgreen";
        }

        })
      .attr("d", arc)
      .each(function(d) { this._current = d; });

//CURRENT SERVING NUMBER
var servingCenter = svg.append("svg:text")
      .attr("class","serving-label")
      .attr("style", function(d) {
        return d.id == "sodium" ? "font-size:20px" : "font-size:50px";
      })
      .attr("dy", function(d) {
            return d.id == "sodium" ? 10 : 19;
        })
      .attr("text-anchor", "middle")
      .text(function(d,i) {return d.servings[0]});

// ANIMATION //
$('.product-box').on('click', function(){
    //flip color
    !productData[this.id]["active"] ? $(this).css("background-color","rgba(255, 255, 0, 0.24)") : $(this).css("background-color","rgba(0, 0, 0, 0.03)");

    //reset all arcs and servings to zero if first time
    if(firstTime) {
        path = path.data(
            function(d) {
                d.servings[0] = 0;
                d.servings[1] = d.maxservings;
                return pie(d.servings);
            });
        servingCenter.text('0');
        path.transition().duration(750).attrTween("d", arcTween);
        firstTime = 0; //shutoff
    }

    //flip active state
    productData[this.id]["active"] = 1 - productData[this.id]["active"];
    prodID = this.id;

    //modify servings and serving arc based on state of each item in json array
    var tInfo = productData[prodID]["info"];
    for (var infoKey in tInfo) {
        path = path.data(function(d){
            if(d.id == infoKey) {
                if(productData[prodID]["active"]) {
                    d.servings[0] += tInfo[infoKey];
                    d.servings[1] -= tInfo[infoKey];
                } else {
                    d.servings[0] -= tInfo[infoKey];
                    d.servings[1] += tInfo[infoKey];
                }
                $("#" + infoKey + " .serving-label").html(d.servings[0]);
                return pie(d.servings);
            } else {
                return pie(d.servings);
            }
        });   
    }
    path.transition().duration(750).attrTween("d", arcTween);
});

//interpolation function to find new arc angle
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}


/*
 * jQuery Simple Slider: Unobtrusive Numerical Slider
 * Version 1.0.0
 *
 * Copyright (c) 2012 James Smith (http://loopj.com)
 *
 * Licensed under the MIT license (http://mit-license.org/)
 *
 */
var __slice=[].slice,__indexOf=[].indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return-1};(function(e,t){var n;return n=function(){function n(n,r){var i,s=this;this.input=n,this.defaultOptions={animate:!0,snapMid:!1},this.settings=e.extend({},this.defaultOptions,r),this.input.hide(),this.slider=e("<div>").addClass("slider").attr("id",this.input.attr("id")+"-slider").css({position:"relative",userSelect:"none",boxSizing:"border-box"}).insertBefore(this.input),this.track=e("<div>").addClass("track").css({position:"absolute",top:"50%",width:"100%",userSelect:"none",cursor:"pointer"}).appendTo(this.slider),this.dragger=e("<div>").addClass("dragger").css({position:"absolute",top:"50%",userSelect:"none",cursor:"pointer"}).appendTo(this.slider),this.slider.css({minHeight:this.dragger.outerHeight(),marginLeft:this.dragger.outerWidth()/2,marginRight:this.dragger.outerWidth()/2}),this.track.css({marginTop:this.track.outerHeight()/-2}),this.dragger.css({marginTop:this.dragger.outerWidth()/-2,marginLeft:this.dragger.outerWidth()/-2}),this.track.mousedown(function(e){if(e.which!==1)return;return s.domDrag(e.pageX,e.pageY,!0),s.dragging=!0,!1}),this.dragger.mousedown(function(e){if(e.which!==1)return;return s.dragging=!0,s.dragger.addClass("dragging"),s.domDrag(e.pageX,e.pageY),!1}),e(t).mousemove(function(t){if(s.dragging)return s.domDrag(t.pageX,t.pageY),e("body").css({cursor:"pointer"})}).mouseup(function(t){if(s.dragging)return s.dragging=!1,s.dragger.removeClass("dragging"),e("body").css({cursor:"auto"})}),this.pagePos=0,this.input.val()===""?(this.value=this.getRange().min,this.input.val(this.value)):this.value=this.nearestValidValue(this.input.val()),this.setSliderPositionFromValue(this.value),i=this.valueToRatio(this.value),this.input.trigger("slider:ready",{value:this.value,ratio:i,position:i*this.slider.outerWidth()})}return n.prototype.setRatio=function(e){var t;return e=Math.min(1,e),e=Math.max(0,e),t=this.ratioToValue(e),this.setSliderPositionFromValue(t),this.valueChanged(t,e,"setRatio")},n.prototype.setValue=function(e){var t;return e=this.nearestValidValue(e),t=this.valueToRatio(e),this.setSliderPositionFromValue(e),this.valueChanged(e,t,"setValue")},n.prototype.domDrag=function(e,t,n){var r,i,s;n==null&&(n=!1),r=e-this.slider.offset().left,r=Math.min(this.slider.outerWidth(),r),r=Math.max(0,r);if(this.pagePos!==r)return this.pagePos=r,i=r/this.slider.outerWidth(),s=this.ratioToValue(i),this.valueChanged(s,i,"domDrag"),this.settings.snap?this.setSliderPositionFromValue(s,n):this.setSliderPosition(r,n)},n.prototype.setSliderPosition=function(e,t){return t==null&&(t=!1),t&&this.settings.animate?this.dragger.animate({left:e},200):this.dragger.css({left:e})},n.prototype.setSliderPositionFromValue=function(e,t){var n;return t==null&&(t=!1),n=this.valueToRatio(e),this.setSliderPosition(n*this.slider.outerWidth(),t)},n.prototype.getRange=function(){return this.settings.allowedValues?{min:Math.min.apply(Math,this.settings.allowedValues),max:Math.max.apply(Math,this.settings.allowedValues)}:this.settings.range?{min:parseFloat(this.settings.range[0]),max:parseFloat(this.settings.range[1])}:{min:0,max:1}},n.prototype.nearestValidValue=function(t){var n,r,i,s;return i=this.getRange(),t=Math.min(i.max,t),t=Math.max(i.min,t),this.settings.allowedValues?(n=null,e.each(this.settings.allowedValues,function(){if(n===null||Math.abs(this-t)<Math.abs(n-t))return n=this}),n):this.settings.step?(r=(i.max-i.min)/this.settings.step,s=Math.floor((t-i.min)/this.settings.step),(t-i.min)%this.settings.step>this.settings.step/2&&s<r&&(s+=1),s*this.settings.step+i.min):t},n.prototype.valueToRatio=function(e){var t,n,r,i,s,o,u,a;if(this.settings.equalSteps){a=this.settings.allowedValues;for(i=o=0,u=a.length;o<u;i=++o){t=a[i];if(typeof n=="undefined"||n===null||Math.abs(t-e)<Math.abs(n-e))n=t,r=i}return this.settings.snapMid?(r+.5)/this.settings.allowedValues.length:r/(this.settings.allowedValues.length-1)}return s=this.getRange(),(e-s.min)/(s.max-s.min)},n.prototype.ratioToValue=function(e){var t,n,r,i,s;return this.settings.equalSteps?(s=this.settings.allowedValues.length,i=Math.round(e*s-.5),t=Math.min(i,this.settings.allowedValues.length-1),this.settings.allowedValues[t]):(n=this.getRange(),r=e*(n.max-n.min)+n.min,this.nearestValidValue(r))},n.prototype.valueChanged=function(t,n,r){var i;if(t.toString()===this.value.toString())return;return this.value=t,i={value:t,ratio:n,position:n*this.slider.outerWidth(),trigger:r},this.input.val(t).trigger(e.Event("change",i)).trigger("slider:changed",i)},n}(),e.extend(e.fn,{simpleSlider:function(){var t,r,i;return i=arguments[0],t=2<=arguments.length?__slice.call(arguments,1):[],r=["setRatio","setValue"],e(this).each(function(){var s,o;return i&&__indexOf.call(r,i)>=0?(s=e(this).data("slider-object"),s[i].apply(s,t)):(o=i,e(this).data("slider-object",new n(e(this),o)))})}}),e(function(){return e("[data-slider]").each(function(){var t,n,r,i,s,o;return t=e(this),i={},n=t.data("slider-values"),n&&(i.allowedValues=function(){var e,t,r,i;r=n.split(","),i=[];for(e=0,t=r.length;e<t;e++)o=r[e],i.push(parseFloat(o));return i}()),r=t.data("slider-range"),r&&(i.range=r.split(",")),s=t.data("slider-step"),s&&(i.step=s),i.snap=t.data("slider-snap"),i.equalSteps=t.data("slider-equal-steps"),t.simpleSlider(i)})})})(this.jQuery||this.Zepto,this);
