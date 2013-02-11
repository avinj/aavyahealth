window.addEvent('domready', function () {
    "use strict";
    var tslider = $('tslider'),
        hslider = $('hslider'),
        lslider = $('lslider'),
        bslider = $('bslider'),
        aslider = $('aslider');


    var tangle = new Tangle(document.getElementById("info"), {
        initialize: function () {
            this.age = 0;
            this.totalchol = 50;
            this.hdl = 0;
            this.ldl = 0;
            this.bp = 70;
            this.bptreated = false;
            this.smoker = false;
            this.gender = true;
            this.diabetic = false;
        },

        update: function () {
            var aRisk = 0,
                bRisk = 0,
                cRisk = 0,
                hRisk = 0,
                sRisk = 0,
                tRisk = 0,
                t120 = 0,
                tchol = 0,
                t120bpRisk = 0,
                tnosmokingRisk = 0,
                tcholRisk = 0,
                t3Risk = 0;

            if (this.gender) {
                // Heart risks in females
                $$(".gender-result").set("text", "female");
                $$(".gender-ref").set("text", "She");
                // 1. Age Risk
                if (this.age < 35) {
                    aRisk -= 7;
                } else if (this.age > 34 && this.age < 40) {
                    aRisk -= 3;
                } else if (this.age > 39 && this.age < 45) {
                    aRisk = 0;
                } else if (this.age > 44 && this.age < 50) {
                    aRisk = 3;
                } else if (this.age > 49 && this.age < 55) {
                    aRisk = 6;
                } else if (this.age > 54 && this.age < 60) {
                    aRisk = 8;
                } else if (this.age > 59 && this.age < 65) {
                    aRisk = 10;
                } else if (this.age > 64 && this.age < 70) {
                    aRisk = 12;
                } else if (this.age > 69 && this.age < 75) {
                    aRisk = 14;
                } else {
                    aRisk = 16; // >75
                }

                // 2. High Blood Pressure Risk
                if (this.bptreated) {
                    if (this.bp > 119 && this.bp < 130) {
                        bRisk = 3;
                        t120 = 3;
                    } else if (this.bp > 129 && this.bp < 140) {
                        bRisk = 4;
                    } else if (this.bp > 139 && this.bp < 160) {
                        bRisk = 5;
                    } else if (this.bp > 159) {
                        bRisk = 6;
                    }

                } else {
                    if (this.bp > 119 && this.bp < 130) {
                        bRisk = 1;
                        t120 = 1;
                    } else if (this.bp > 129 && this.bp < 140) {
                        bRisk = 2;
                    } else if (this.bp > 139 && this.bp < 160) {
                        bRisk = 3;
                    } else if (this.bp > 159) {
                        bRisk = 4;
                    }
                }

                // 3. Total Cholesterol Level Risk
                if (this.age > 19 && this.age < 40) {
                    if (this.totalchol > 159 && this.totalchol < 200) {
                        cRisk = 4;
                        tchol = 4;
                    } else if (this.totalchol > 199 && this.totalchol < 240) {
                        cRisk = 8;
                    } else if (this.totalchol > 239 && this.totalchol < 280) {
                        cRisk = 11;
                    } else if (this.totalchol > 279) {
                        cRisk = 13;
                    }
                } else if (this.age > 39 && this.age < 50) {
                    if (this.totalchol > 159 && this.totalchol < 200) {
                        cRisk = 3;
                        tchol = 3;
                    } else if (this.totalchol > 199 && this.totalchol < 240) {
                        cRisk = 6;
                    } else if (this.totalchol > 239 && this.totalchol < 280) {
                        cRisk = 8;
                    } else if (this.totalchol > 279) {
                        cRisk = 10;
                    }
                } else if (this.age > 49 && this.age < 60) {
                    if (this.totalchol > 159 && this.totalchol < 200) {
                        cRisk = 2;
                        tchol = 2;
                    } else if (this.totalchol > 199 && this.totalchol < 240) {
                        cRisk = 4;
                    } else if (this.totalchol > 239 && this.totalchol < 280) {
                        cRisk = 5;
                    } else if (this.totalchol > 279) {
                        cRisk = 7;
                    }
                } else if (this.age > 59 && this.age < 70) {
                    if (this.totalchol > 159 && this.totalchol < 200) {
                        cRisk = 1;
                        tchol = 1;
                    } else if (this.totalchol > 199 && this.totalchol < 240) {
                        cRisk = 2;
                    } else if (this.totalchol > 239 && this.totalchol < 280) {
                        cRisk = 3;
                    } else if (this.totalchol > 279) {
                        cRisk = 4;
                    }
                } else if (this.age > 69) {
                    if (this.totalchol > 159 && this.totalchol < 200) {
                        cRisk = 1;
                        tchol = 1;
                    } else if (this.totalchol > 199 && this.totalchol < 240) {
                        cRisk = 1;
                    } else if (this.totalchol > 239 && this.totalchol < 280) {
                        cRisk = 2;
                    } else if (this.totalchol > 279) {
                        cRisk = 2;
                    }
                }

                // 4. HDL Level Risk
                if (this.hdl > 59) {
                    hRisk -= 1;
                } else if (this.hdl > 49 && this.hdl < 60) {
                    hRisk = 0;
                } else if (this.hdl > 39 && this.hdl < 50) {
                    hRisk = 1;
                } else if (this.hdl < 40) {
                    hRisk = 2;
                }

                // 5. Smoking Risk
                if (this.smoker) {
                    if (this.age < 40) {
                        sRisk = 9;
                    } else if (this.age > 39 && this.age < 50) {
                        sRisk = 7;
                    } else if (this.age > 49 && this.age < 60) {
                        sRisk = 4;
                    } else if (this.age > 59 && this.age < 70) {
                        sRisk = 2;
                    } else if (this.age > 69) {
                        sRisk = 1;
                    }
                }

                // 6. 10-Year Risk
                tRisk = aRisk + bRisk + cRisk + hRisk + sRisk;
                // If Max BP = 120mm/Hg
                t120bpRisk = tRisk - bRisk + t120;
                // If Non Smoker
                tnosmokingRisk = tRisk - sRisk;
                // If Total cholesterol = 160 mg/DL
                tcholRisk = tRisk - cRisk + tchol;
                // If MaxBP = 120 mm/Hg AND Non Smoker AND total chol. = 160 mg/DL
                t3Risk = aRisk + t120 + tchol + hRisk;
                if (9 > tRisk) {
                    this.risk = 0.5;
                } else if (8 < tRisk && 13 > tRisk) {
                    this.risk = 1;
                } else if (12 < tRisk && 15 > tRisk) {
                    this.risk = 2;
                } else if (15 === tRisk) {
                    this.risk = 3;
                } else if (16 === tRisk) {
                    this.risk = 4;
                } else if (17 === tRisk) {
                    this.risk = 5;
                } else if (18 === tRisk) {
                    this.risk = 6;
                } else if (19 === tRisk) {
                    this.risk = 8;
                } else if (20 === tRisk) {
                    this.risk = 11;
                } else if (21 === tRisk) {
                    this.risk = 14;
                } else if (22 === tRisk) {
                    this.risk = 17;
                } else if (23 === tRisk) {
                    this.risk = 22;
                } else if (24 === tRisk) {
                    this.risk = 27;
                } else if (25 <= tRisk) {
                    this.risk = 30;
                }

                if (9 > t120bpRisk) {
                    this.bprisk = 0.5;
                } else if (8 < t120bpRisk && 13 > t120bpRisk) {
                    this.bprisk = 1;
                } else if (12 < t120bpRisk && 15 > t120bpRisk) {
                    this.bprisk = 2;
                } else if (15 === t120bpRisk) {
                    this.bprisk = 3;
                } else if (16 === t120bpRisk) {
                    this.bprisk = 4;
                } else if (17 === t120bpRisk) {
                    this.bprisk = 5;
                } else if (18 === t120bpRisk) {
                    this.bprisk = 6;
                } else if (19 === t120bpRisk) {
                    this.bprisk = 8;
                } else if (20 === t120bpRisk) {
                    this.bprisk = 11;
                } else if (21 === t120bpRisk) {
                    this.bprisk = 14;
                } else if (22 === t120bpRisk) {
                    this.bprisk = 17;
                } else if (23 === t120bpRisk) {
                    this.bprisk = 22;
                } else if (24 === t120bpRisk) {
                    this.bprisk = 27;
                } else if (25 <= t120bpRisk) {
                    this.bprisk = 30;
                }

                if (9 > tnosmokingRisk) {
                    this.nsrisk = 0.5;
                } else if (8 < tnosmokingRisk && 13 > tnosmokingRisk) {
                    this.nsrisk = 1;
                } else if (12 < tnosmokingRisk && 15 > tnosmokingRisk) {
                    this.nsrisk = 2;
                } else if (15 === tnosmokingRisk) {
                    this.nsrisk = 3;
                } else if (16 === tnosmokingRisk) {
                    this.nsrisk = 4;
                } else if (17 === tnosmokingRisk) {
                    this.nsrisk = 5;
                } else if (18 === tnosmokingRisk) {
                    this.nsrisk = 6;
                } else if (19 === tnosmokingRisk) {
                    this.nsrisk = 8;
                } else if (20 === tnosmokingRisk) {
                    this.nsrisk = 11;
                } else if (21 === tnosmokingRisk) {
                    this.nsrisk = 14;
                } else if (22 === tnosmokingRisk) {
                    this.nsrisk = 17;
                } else if (23 === tnosmokingRisk) {
                    this.nsrisk = 22;
                } else if (24 === tnosmokingRisk) {
                    this.nsrisk = 27;
                } else if (25 <= tnosmokingRisk) {
                    this.nsrisk = 30;
                }

                if (9 > tcholRisk) {
                    this.chrisk = 0.5;
                } else if (8 < tcholRisk && 13 > tcholRisk) {
                    this.chrisk = 1;
                } else if (12 < tcholRisk && 15 > tcholRisk) {
                    this.chrisk = 2;
                } else if (15 === tcholRisk) {
                    this.chrisk = 3;
                } else if (16 === tcholRisk) {
                    this.chrisk = 4;
                } else if (17 === tcholRisk) {
                    this.chrisk = 5;
                } else if (18 === tcholRisk) {
                    this.chrisk = 6;
                } else if (19 === tcholRisk) {
                    this.chrisk = 8;
                } else if (20 === tcholRisk) {
                    this.chrisk = 11;
                } else if (21 === tcholRisk) {
                    this.chrisk = 14;
                } else if (22 === tcholRisk) {
                    this.chrisk = 17;
                } else if (23 === tcholRisk) {
                    this.chrisk = 22;
                } else if (24 === tcholRisk) {
                    this.chrisk = 27;
                } else if (25 <= tcholRisk) {
                    this.chrisk = 30;
                }

                if (9 > t3Risk) {
                    this.t3risk = 0.5;
                } else if (8 < t3Risk && 13 > t3Risk) {
                    this.t3risk = 1;
                } else if (12 < t3Risk && 15 > t3Risk) {
                    this.t3risk = 2;
                } else if (15 === t3Risk) {
                    this.t3risk = 3;
                } else if (16 === t3Risk) {
                    this.t3risk = 4;
                } else if (17 === t3Risk) {
                    this.t3risk = 5;
                } else if (18 === t3Risk) {
                    this.t3risk = 6;
                } else if (19 === t3Risk) {
                    this.t3risk = 8;
                } else if (20 === t3Risk) {
                    this.t3risk = 11;
                } else if (21 === t3Risk) {
                    this.t3risk = 14;
                } else if (22 === t3Risk) {
                    this.t3risk = 17;
                } else if (23 === t3Risk) {
                    this.t3risk = 22;
                } else if (24 === t3Risk) {
                    this.t3risk = 27;
                } else if (25 <= t3Risk) {
                    this.t3risk = 30;
                }

            } else {
                // Heart risks in males
                $$(".gender-result").set("text", "male");
                $$(".gender-ref").set("text", "He");
                // 1. Age Risk
                if (this.age < 35) {
                    aRisk -= 9;
                } else if (this.age > 34 && this.age < 40) {
                    aRisk -= 4;
                } else if (this.age > 39 && this.age < 45) {
                    aRisk = 0;
                } else if (this.age > 44 && this.age < 50) {
                    aRisk = 3;
                } else if (this.age > 49 && this.age < 55) {
                    aRisk = 6;
                } else if (this.age > 54 && this.age < 60) {
                    aRisk = 8;
                } else if (this.age > 59 && this.age < 65) {
                    aRisk = 10;
                } else if (this.age > 64 && this.age < 70) {
                    aRisk = 11;
                } else if (this.age > 69 && this.age < 75) {
                    aRisk = 12;
                } else {
                    aRisk = 13; // >75
                }

                // 2. High Blood Pressure Risk
                if (this.bptreated) {
                    if (this.bp > 119 && this.bp < 130) {
                        bRisk = 1;
                        t120 = 1;
                    } else if (this.bp > 129 && this.bp < 140) {
                        bRisk = 2;
                    } else if (this.bp > 139 && this.bp < 160) {
                        bRisk = 2;
                    } else if (this.bp > 159) {
                        bRisk = 3;
                    }

                } else {
                    if (this.bp > 129 && this.bp < 140) {
                        bRisk = 1;
                    } else if (this.bp > 139 && this.bp < 160) {
                        bRisk = 1;
                    } else if (this.bp > 159) {
                        bRisk = 2;
                    }
                }

                // 3. Total Cholesterol Level Risk
                if (this.age > 19 && this.age < 40) {
                    if (this.totalchol > 159 && this.totalchol < 200) {
                        cRisk = 4;
                        tchol = 4;
                    } else if (this.totalchol > 199 && this.totalchol < 240) {
                        cRisk = 7;
                    } else if (this.totalchol > 239 && this.totalchol < 280) {
                        cRisk = 9;
                    } else if (this.totalchol > 279) {
                        cRisk = 11;
                    }
                } else if (this.age > 39 && this.age < 50) {
                    if (this.totalchol > 159 && this.totalchol < 200) {
                        cRisk = 3;
                        tchol = 3;
                    } else if (this.totalchol > 199 && this.totalchol < 240) {
                        cRisk = 5;
                    } else if (this.totalchol > 239 && this.totalchol < 280) {
                        cRisk = 6;
                    } else if (this.totalchol > 279) {
                        cRisk = 8;
                    }
                } else if (this.age > 49 && this.age < 60) {
                    if (this.totalchol > 159 && this.totalchol < 200) {
                        cRisk = 2;
                        tchol = 2;
                    } else if (this.totalchol > 199 && this.totalchol < 240) {
                        cRisk = 3;
                    } else if (this.totalchol > 239 && this.totalchol < 280) {
                        cRisk = 4;
                    } else if (this.totalchol > 279) {
                        cRisk = 5;
                    }
                } else if (this.age > 59 && this.age < 70) {
                    if (this.totalchol > 159 && this.totalchol < 200) {
                        cRisk = 1;
                        tchol = 1;
                    } else if (this.totalchol > 199 && this.totalchol < 240) {
                        cRisk = 1;
                    } else if (this.totalchol > 239 && this.totalchol < 280) {
                        cRisk = 2;
                    } else if (this.totalchol > 279) {
                        cRisk = 3;
                    }
                } else if (this.age > 69) {
                    if (this.totalchol > 239) {
                        cRisk = 1;
                    }
                }

                // 4. HDL Level Risk
                if (this.hdl > 59) {
                    hRisk -= 1;
                } else if (this.hdl > 49 && this.hdl < 60) {
                    hRisk = 0;
                } else if (this.hdl > 39 && this.hdl < 50) {
                    hRisk = 1;
                } else if (this.hdl < 40) {
                    hRisk = 2;
                }

                // 5. Smoking Risk
                if (this.smoker) {
                    if (this.age < 40) {
                        sRisk = 8;
                    } else if (this.age > 39 && this.age < 50) {
                        sRisk = 5;
                    } else if (this.age > 49 && this.age < 60) {
                        sRisk = 3;
                    } else if (this.age > 59) {
                        sRisk = 1;
                    }
                }

                // 6. 10-Year Risk
                tRisk = aRisk + bRisk + cRisk + hRisk + sRisk;
                // If Max BP = 120mm/Hg
                t120bpRisk = tRisk - bRisk + t120;
                // If Non Smoker
                tnosmokingRisk = tRisk - sRisk;
                // If Total cholesterol = 160 mg/DL
                tcholRisk = tRisk - cRisk + tchol;
                // If MaxBP = 120 mm/Hg AND Non Smoker AND total chol. = 160 mg/DL
                t3Risk = aRisk + t120 + tchol + hRisk;
                if (5 > tRisk) {
                    this.risk = 1;
                } else if (4 < tRisk && 7 > tRisk) {
                    this.risk = 2;
                } else if (7 === tRisk) {
                    this.risk = 3;
                } else if (8 === tRisk) {
                    this.risk = 4;
                } else if (9 === tRisk) {
                    this.risk = 5;
                } else if (10 === tRisk) {
                    this.risk = 6;
                } else if (11 === tRisk) {
                    this.risk = 8;
                } else if (12 === tRisk) {
                    this.risk = 10;
                } else if (13 === tRisk) {
                    this.risk = 12;
                } else if (14 === tRisk) {
                    this.risk = 16;
                } else if (25 === tRisk) {
                    this.risk = 20;
                } else if (16 === tRisk) {
                    this.risk = 25;
                } else if (16 < tRisk) {
                    this.risk = 30;
                }

                if (5 > t120bpRisk) {
                    this.bprisk = 1;
                } else if (4 < t120bpRisk && 7 > t120bpRisk) {
                    this.bprisk = 2;
                } else if (7 === t120bpRisk) {
                    this.bprisk = 3;
                } else if (8 === t120bpRisk) {
                    this.bprisk = 4;
                } else if (9 === t120bpRisk) {
                    this.bprisk = 5;
                } else if (10 === t120bpRisk) {
                    this.bprisk = 6;
                } else if (11 === t120bpRisk) {
                    this.bprisk = 8;
                } else if (12 === t120bpRisk) {
                    this.bprisk = 10;
                } else if (13 === t120bpRisk) {
                    this.bprisk = 12;
                } else if (14 === t120bpRisk) {
                    this.bprisk = 16;
                } else if (25 === t120bpRisk) {
                    this.bprisk = 20;
                } else if (16 === t120bpRisk) {
                    this.bprisk = 25;
                } else if (16 < t120bpRisk) {
                    this.bprisk = 30;
                }

                if (5 > tnosmokingRisk) {
                    this.nsrisk = 1;
                } else if (4 < tnosmokingRisk && 7 > tnosmokingRisk) {
                    this.nsrisk = 2;
                } else if (7 === tnosmokingRisk) {
                    this.nsrisk = 3;
                } else if (8 === tnosmokingRisk) {
                    this.nsrisk = 4;
                } else if (9 === tnosmokingRisk) {
                    this.nsrisk = 5;
                } else if (10 === tnosmokingRisk) {
                    this.nsrisk = 6;
                } else if (11 === tnosmokingRisk) {
                    this.nsrisk = 8;
                } else if (12 === tnosmokingRisk) {
                    this.nsrisk = 10;
                } else if (13 === tnosmokingRisk) {
                    this.nsrisk = 12;
                } else if (14 === tnosmokingRisk) {
                    this.nsrisk = 16;
                } else if (25 === tnosmokingRisk) {
                    this.nsrisk = 20;
                } else if (16 === tnosmokingRisk) {
                    this.nsrisk = 25;
                } else if (16 < tnosmokingRisk) {
                    this.nsrisk = 30;
                }

                if (5 > tcholRisk) {
                    this.chrisk = 1;
                } else if (4 < tcholRisk && 7 > tcholRisk) {
                    this.chrisk = 2;
                } else if (7 === tcholRisk) {
                    this.chrisk = 3;
                } else if (8 === tcholRisk) {
                    this.chrisk = 4;
                } else if (9 === tcholRisk) {
                    this.chrisk = 5;
                } else if (10 === tcholRisk) {
                    this.chrisk = 6;
                } else if (11 === tcholRisk) {
                    this.chrisk = 8;
                } else if (12 === tcholRisk) {
                    this.chrisk = 10;
                } else if (13 === tcholRisk) {
                    this.chrisk = 12;
                } else if (14 === tcholRisk) {
                    this.chrisk = 16;
                } else if (25 === tcholRisk) {
                    this.chrisk = 20;
                } else if (16 === tcholRisk) {
                    this.chrisk = 25;
                } else if (16 < tcholRisk) {
                    this.chrisk = 30;
                }

                if (5 > t3Risk) {
                    this.t3risk = 1;
                } else if (4 < t3Risk && 7 > t3Risk) {
                    this.t3risk = 2;
                } else if (7 === t3Risk) {
                    this.t3risk = 3;
                } else if (8 === t3Risk) {
                    this.t3risk = 4;
                } else if (9 === t3Risk) {
                    this.t3risk = 5;
                } else if (10 === t3Risk) {
                    this.t3risk = 6;
                } else if (11 === t3Risk) {
                    this.t3risk = 8;
                } else if (12 === t3Risk) {
                    this.t3risk = 10;
                } else if (13 === t3Risk) {
                    this.t3risk = 12;
                } else if (14 === t3Risk) {
                    this.t3risk = 16;
                } else if (25 === t3Risk) {
                    this.t3risk = 20;
                } else if (16 === t3Risk) {
                    this.t3risk = 25;
                } else if (16 < t3Risk) {
                    this.t3risk = 30;
                }
            }

            // Set Variables for circle (risk) radius and font-size
            this.radius = this.risk;
            this.fsize = this.risk;
            this.bpradius = this.bprisk;
            this.bpfsize = this.bprisk;
            this.nsradius = this.nsrisk;
            this.nsfsize = this.nsrisk;
            this.chradius = this.chrisk;
            this.chfsize = this.chrisk;
            this.t3radius = this.t3risk;
            this.t3fsize = this.t3risk;

            // Hide elements if risk = low risk
            if (!this.smoker || this.nsrisk === this.risk) {
                $('nsr').setStyle('display', 'none');
            } else {
                $('nsr').setStyle('display', '');
            }

            if (this.bprisk === this.risk) {
                $('bpr').setStyle('display', 'none');
            } else {
                $('bpr').setStyle('display', '');
            }

            if (this.chrisk === this.risk) {
                $('chr').setStyle('display', 'none');
            } else {
                $('chr').setStyle('display', '');
            }

            if (this.t3risk === this.risk) {
                $('t3r').setStyle('display', 'none');
            } else {
                $('t3r').setStyle('display', '');
            }


        } // update
    });

    // Age Slider
    var as = new MSlider(aslider, aslider.getElement('.knob'), {
        range: [0, 120],
        initialStep: 0,
        onChange: function (value) {
            $('age').empty().set('html', '<span>' + value + '</span>');
            tangle.setValue("age", value);
        }
    });

    // Total cholesterol slider
    var ts = new MSlider(tslider, tslider.getElement('.knob'), {
        range: [50, 400],
        initialStep: 50,
        onChange: function (value) {
            $('tchol').empty().set('html', '<span>' + value + '</span>');
            tangle.setValue("totalchol", value);
            stackupDataTC[0] = value;
            drawChart(stackupDataTC, "tc");
            reducedStats[0] = Math.round(reducedBy * value);
            reducedStats[1] = value;
            drawChart(reducedStats, "rs");
        }
    });

    // HDL slider
    var hs = new MSlider(hslider, hslider.getElement('.knob'), {
        range: [10, 80],
        initialStep: 0,
        onChange: function (value) {
            $('hchol').empty().set('html', '<span>' + value + '</span>');
            tangle.setValue("hdl", value);
            stackupDataHC[0] = value;
            drawChart(stackupDataHC, "hc");
        }
    });

    // LDL slider
    var ls = new MSlider(lslider, lslider.getElement('.knob'), {
        range: [60, 250],
        initialStep: 0,
        onChange: function (value) {
            $('lchol').empty().set('html', '<span>' + value + '</span>');
            tangle.setValue("ldl", value);
            stackupDataLC[0] = value;
            drawChart(stackupDataLC, "lc");
        }
    });

    // Blood pressure slider
    var bs = new MSlider(bslider, bslider.getElement('.knob'), {
        range: [70, 200],
        initialStep: 70,
        onChange: function (value) {
            // Show results and comparision only when bp > 70
            if (value > 70 ) {
                $('theresults').fade('in');
                $('stackup').fade('in');
            } else {
                $('theresults').fade('out');
                $('stackup').fade('out');
            }
            $('bp').empty().set('html', '<span>' + value + '</span>');
            tangle.setValue("bp", value);
        }
    });

    window.addEvent('resize', function(){
        as.autosize();
        ts.autosize();
        hs.autosize();
        ls.autosize();
        bs.autosize();
    });
}); // document.ready


Tangle.classes.MWScaleup = {
    initialize: function (element, tangle) {
        "use strict";
        this.tangle = tangle;
    },

    update: function (element, fsize) {
        "use strict";
        var val = 10 / fsize;
        element.setStyles({
            "-webkit-transform": "scale(" + val + ")",
            "-moz-transform": "scale(" + val + ")",
            "-ms-transform": "scale(" + val + ")",
            "-o-transform": "scale(" + val + ")",
            "transform": "scale(" + val + ")",
            "opacity": 1
        });
    }

};

Tangle.classes.MWScaledown = {
    initialize: function (element, tangle) {
        "use strict";
        this.tangle = tangle;
    },

    update: function (element, radius) {
        "use strict";
        var val = radius / 10,
            bgcolor;
        if (radius <= 1) {
            bgcolor = "114, 193, 176"; // Green: Risk upto 1%
        } else if (radius > 1 && radius <= 9) {
            bgcolor = "253, 189, 18"; // Yellow: Risk upto 9%
        } else if (radius > 10) {
            bgcolor = "218, 60, 38"; // Red: Risk > 9%
        }
        element.setStyles({
            "-webkit-transform": "scale(" + val + ")",
            "-moz-transform": "scale(" + val + ")",
            "-ms-transform": "scale(" + val + ")",
            "-o-transform": "scale(" + val + ")",
            "transform": "scale(" + val + ")",
            "background-color": "rgba(" + bgcolor + ", 0.65)",
            "opacity": 1
        });
    }

};

// Bar charts
var stackupDataTC = [210, 200]; // total cholesterol
var stackupDataLC = [110, 120]; // ldl cholesterol
var stackupDataHC = [140, 60]; // hdl cholesterol
var reducedStats = [180, 250];
var reducedBy = 0.8; // Variable percentage reduction upon using medication

var drawChart = function(data, classname) {
    d3.select("." + classname + " div").remove();
    if (classname === "rs") {
        // Reduced risk chart
        d3.select("." + classname)
            .append("div")
            .attr("class", "chart")
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("div")
                .attr("class", "bar-rs")
                .style("width", function(d) {return Math.round(d/1.95) + "px"})
                .style("color", function(d) {if (d <= 40) {return "#000"}})
                    .append("span")
                    .text(function(d) {return d})
                    .style("position", function(d) {if (d <= 119) {return "absolute"}})
                    .style("margin-left", function(d) {if (d <= 119) {return "8px"}})
                    .style("color", function(d) {if (d <= 119) {return "#000"}});
    } else if (classname === "tc") {
        // Total Cholesterol
        d3.select("." + classname)
            .append("div")
            .attr("class", "chart")
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("div")
                .attr("class", "bar")
                .style("width", function(d) {return Math.round(d/2) + "px"})
                    .append("span")
                    .text(function(d) {return d})
                    .style("position", function(d) {if (d <= 200) {return "absolute"}})
                    .style("margin-left", function(d) {if (d <= 200) {return "8px"}})
                    .style("color", function(d) {if (d <= 200) {return "#000"}});
    } else if (classname === "lc") {
        // LDL Cholesterol
        d3.select("." + classname)
            .append("div")
            .attr("class", "chart")
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("div")
                .attr("class", "bar")
                .style("width", function(d) {return Math.round(d) + "px"})
                .style("color", function(d) {if (d <= 60) {return "#000"}})
                    .append("span")
                    .text(function(d) {return d})
                    .style("position", function(d) {if (d <= 200) {return "absolute"}})
                    .style("margin-left", function(d) {if (d <= 200) {return "8px"}})
                    .style("color", function(d) {if (d <= 200) {return "#000"}});
    } else {
        // HDL Cholesterol
        d3.select("." + classname)
            .append("div")
            .attr("class", "chart")
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("div")
                .attr("class", "bar")
                .style("width", function(d) {return d * 1.25 + "px"})
                .style("color", function(d) {if (d <= 30) {return "#000"}})
                    .append("span")
                    .text(function(d) {return d})
                    .style("position", function(d) {if (d <= 100) {return "absolute"}})
                    .style("margin-left", function(d) {if (d <= 100) {return "8px"}})
                    .style("color", function(d) {if (d <= 100) {return "#000"}});
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
     .attr("dy", 55)
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


////// "LAZY" LOAD GRAPHS ////
var minView = document.body.scrollHeight*.40;
var ss = new ScrollSpy({ 
    min: minView, 
        onEnter: function() { 
            $('diet-charts').morph({opacity: 1});
        }, 
        //onLeave: function() { 
        //    $('diet-charts').morph({opacity: 0});
        //} 
});


// ANIMATION //
$$('.product-box').addEvent('click', function(){
    //flip color
    !productData[this.id]["active"] ? this.setStyle("background-color","rgba(255, 255, 0, 0.24)") : this.setStyle("background-color","rgba(0, 0, 0, 0.03)");

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
                $(infoKey).getElementsByTagName('g')[0].getElementsByClassName('serving-label')[0].textContent = d.servings[0];
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