(function () {
    document.onreadystatechange = function () {
        let chart;
        if (document.readyState === "complete") {
            let ctx = document.getElementById("componentDisplayChart");
            chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: [
                        "MOVE",
                        "WORK",
                        "CARRY",
                        "ATTACK",
                        "RANGED_ATTACK",
                        "HEAL",
                        "CLAIM",
                        "TOUGH"],
                    datasets: [{
                        data: [0, 0, 0, 0, 0, 0, 0, 0],
                        backgroundColor: [
                            '#a9b7c6',
                            '#ffe56d',
                            '#777',
                            "#f93842",
                            "#5d80b2",
                            "#65fd62",
                            "#b99cfb",
                            "#000"
                        ],
                        hoverBackgroundColor: [
                            '#a9b7c6',
                            '#ffe56d',
                            '#777',
                            "#f93842",
                            "#5d80b2",
                            "#65fd62",
                            "#b99cfb",
                            "#000"
                        ],
                        hoverBorderColor: "rgba(234, 236, 244, 1)",
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    tooltips: {
                        backgroundColor: "rgb(255,255,255)",
                        bodyFontColor: "#858796",
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        caretPadding: 10,
                    },
                    legend: {
                        display: false
                    },
                    cutoutPercentage: 80,
                },
            });
        }

        const bodyComponents = {
            move: {
                cost: 50,
                colour: ""
            },
            work: {
                cost: 100,
                colour: ""
            },
            carry: {
                cost: 50,
                colour: ""
            },
            attack: {
                cost: 80,
                colour: ""
            },
            ranged_attack: {
                cost: 150,
                colour: ""
            },
            heal: {
                cost: 250,
                colour: ""
            },
            claim: {
                cost: 600,
                colour: ""
            },
            tough: {
                cost: 10,
                colour: ""
            }
        };


        const bodyArray = [];
        const bodyCosts = {
            move: 50,
            work: 100,
            carry: 50,
            attack: 80,
            ranged_attack: 150,
            heal: 250,
            claim: 600,
            tough: 10

        };

        if (document.readyState === "complete") {
            Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
            Chart.defaults.global.defaultFontColor = '#858796';
            addEventListeners();
        }

        function addEventListeners() {
            let bodyButtons = document.getElementsByClassName("addBodyComponentButton");
            for (let i = 0; i < bodyButtons.length; i++) {
                bodyButtons[i].addEventListener("click", addBodyComponent);
            }
            document.getElementById("clearButton").addEventListener("click", clearComponents);
            document.getElementById("addedComponentsDiv").addEventListener("click", removeBodyComponent);
            document.getElementById("fill-button").addEventListener("click", fillBody);
            document.getElementById("copyBodyButton").addEventListener("click", copyBody);
        }

        /***
         * Action executed when an "addBodyComponentButton" is pressed
         * @param e event object
         */
        function addBodyComponent(e) {
            if (bodyArray.length >= 50) {
                return;
            }

            bodyArray.push(e.currentTarget.innerText.trim());
            update();
        }

        /***
         * Event triggered when an added component button is clicked
         * @param e event object
         */
        function removeBodyComponent(e) {
            if (e.target.id === "addedComponentsDiv") {
                return;
            }
            bodyArray.splice(e.target.value, 1);
            update();
        }

        /**
         * Clear components button event
         * @param e event object
         * */
        function clearComponents(e) {
            bodyArray.splice(0, bodyArray.length);
            update();

        }

        /***
         * Top-level function that calls all functions needed to completely update the display when the number
         * of added components changes
         */
        function update() {
            updateBodyCostDisplay();
            updateAddedComponentDisplay();
            updateBodyStringDisplay();
            updateComponentCountDisplay();
            updateComponentCountTable();
            updateProgressBar();
        }

        /***
         * Updates the body cost numerical display
         */
        function updateBodyCostDisplay() {
            document.getElementById("bodyCostDiv").innerText = String(calculateBodyCost());
        }

        /***
         * Calculate the cost of the body based on the components in the bodyArray
         * @return {number} - the sum of all body components added by the user
         */
        function calculateBodyCost() {
            let total = 0;
            bodyArray.forEach((value) => {
                total += bodyCosts[value.toLowerCase()];
            });

            return total;
        }

        /***
         * Update the display of clickable body components
         */
        function updateAddedComponentDisplay() {
            let addedComponentsDiv = document.getElementById("addedComponentsDiv");
            let componentString = "";

            bodyArray.forEach((v, i) => {
                componentString += `<button class='addedComponent ${v.toLowerCase()}' value="${i}">${v}</button>`;
            });

            addedComponentsDiv.innerHTML = componentString;
        }

        function updateComponentCountDisplay() {
            document.getElementById("bodyComponentCount").innerText = `(${bodyArray.length}/50)`;
        }

        /***
         * Update the text display that shows the array representation of components in the interface
         */
        function updateBodyStringDisplay() {
            let recipeDiv = document.getElementById("bodyRecipeArray");
            if (bodyArray.length === 0) {
                recipeDiv.innerText = "";
                return;
            }

            let bodyString = "[";
            bodyArray.forEach((v, i) => {
                if (i !== 0) {
                    bodyString += ", ";
                }
                bodyString += `<span class="${v.toLowerCase()}">${v}</span>`;
            });

            bodyString += "]";

            recipeDiv.innerHTML = bodyString;
        }

        /**
         * Update the table that shows counts of added components
         * */
        function updateComponentCountTable() {
            let count = {
                MOVE: 0,
                WORK: 0,
                CARRY: 0,
                ATTACK: 0,
                RANGED_ATTACK: 0,
                HEAL: 0,
                CLAIM: 0,
                TOUGH: 0
            };

            bodyArray.forEach(value => {
                count[value]++;
            });

            // let ctx = document.getElementById("componentDisplayChart");

            console.log(chart.data);
            console.log(Object.values(count));

            chart.data.datasets[0].data = Object.values(count);

            chart.update();
            chart.render();

            for (let e in count) {
                document.getElementById(`${e.toLowerCase()}ComponentCountCell`).innerText = count[e];
            }

        }

        /**
         * Update the progress bar
         * */
        function updateProgressBar() {
            let progressBar = document.getElementById("progress");
            let percent = bodyArray.length * 2;
            let percentFullDisplay = document.getElementById("percent-full-value-display");
            progressBar.style.width = percent + "%";
            percentFullDisplay.innerText = percent + "%";

        }

        /**
         * Copy the array string of added components to the clipboard
         * */
        function copyBody(e) {
            if (document.getElementById("copy-success-tick") !== null) {
                return;
            }
            let recipeDiv = document.getElementById("bodyRecipeArray");

            if (bodyArray.length < 1) {
                e.currentTarget.classList.remove("btn-success");
                e.currentTarget.classList.add("btn-danger");
                setTimeout(() => {
                        console.log(this);
                        this.classList.remove("btn-danger");
                        this.classList.add("btn-success");
                        this.classList.remove("btn-danger");
                    },
                    500);
                return;
            }

            let inp = document.createElement("input");
            inp.value = recipeDiv.innerText;

            document.getElementsByTagName("body")[0].appendChild(inp);

            inp.select();
            document.execCommand("Copy");

            document.getElementsByTagName("body")[0].removeChild(inp);

            let tick = document.createElement("i");
            let container = document.getElementById("copy-success-display");
            tick.classList = "fas fa-check text-success";
            tick.id = "copy-success-tick";
            tick.style.display = "none";

            container.appendChild(tick);
            $(tick).fadeIn(100, () => {
                console.log("Complete fade in");
                $(tick).fadeOut(1000, () => {
                    container.removeChild(tick);
                })
            });

        }

        /**
         * Add copies of currently added components until the body is full.
         * */
        function fillBody() {
            if (bodyArray.length === 0 || bodyArray.length > 25) {

                return;
            }

            let pattern = [...bodyArray];
            let i = Math.floor(50 / bodyArray.length);

            for (; i > 1; i--) {
                bodyArray.push(...pattern);
            }

            update();
        }
    }
}());