(function () {

    document.onreadystatechange = function () {
        const addedComponentsDiv = document.getElementById("addedComponentsDiv");
        const bodyCostDiv = document.getElementById("bodyCostDiv");
        var bodyRecipeArray = [];
        var componentCount = {
            move: 0,
            work: 0,
            carry: 0,
            attack: 0,
            ranged_attack: 0,
            heal: 0,
            claim: 0,
            tough: 0
        };
        const bodyComponentCount = document.getElementById("bodyComponentCount");

        if (document.readyState === "complete") {
            let bodyButtons = document.getElementsByClassName("bodyComponentButton");

            for (let i = 0; i < bodyButtons.length; i++) {
                bodyButtons[i].addEventListener("click", bodyButtonEventListener);
            }

            document.getElementById("copyBodyButton").addEventListener("click", copyBodyStringButtonListener);
            document.getElementById("addedComponentsDiv").addEventListener("click", addedComponentsEventListener);
            document.getElementById("clearButton").addEventListener("click", clearButtonEventListener);

        }

        function bodyButtonEventListener(e) {
            if (bodyRecipeArray.length >= 50) {
                return;

            }
            let value = e.target.value;
            let total = Number(bodyCostDiv.innerText);

            addedComponentsDiv.innerHTML += "<button class='addedComponent " + e.target.innerText.toLowerCase() + " ' value='" + value + "'>" + e.target.innerText + "</button> ";

            total += Number(value);
            bodyCostDiv.innerText = total;
            componentCount[e.target.innerText.toLowerCase()]++;
            generateComponentArrayString();
            updateComponentCountTable();
        }

        function addedComponentsEventListener(e) {
            // if the div is clicked, don't break
            if (e.target === this) {
                return;
            }

            let value = e.target.value;
            let total = Number(bodyCostDiv.innerText);

            total -= Number(value);
            bodyCostDiv.innerText = total;

            this.removeChild(e.target);
            componentCount[e.target.innerText.toLowerCase()]--;

            generateComponentArrayString();
            updateComponentCountTable();

        }

        function clearButtonEventListener() {
            bodyCostDiv.innerText = 0;
            addedComponentsDiv.innerHTML = "";
            bodyRecipeArray = [];
            generateComponentArrayString();
            updateRecipeArray();
            resetComponentCountObject();
            updateComponentCountTable();
        }

        function updateRecipeArray() {
            bodyRecipeArray = document.getElementsByClassName("addedComponent");
            updateComponentCountDisplay();

        }

        function updateComponentCountDisplay() {
            bodyComponentCount.innerText = "(" + bodyRecipeArray.length + "/50)";
            updateProgressBar();
        }

        function generateComponentArrayString() {
            let recipeDiv = document.getElementById("bodyRecipeArray");
            let components = document.getElementsByClassName("addedComponent");
            if (components.length === 0) {
                recipeDiv.innerHTML = "";
                return;
            }
            recipeDiv.innerHTML = "[";
            for (let i = 0; i < components.length; i++) {
                if (i !== 0) {
                    recipeDiv.innerHTML += ", ";

                }

                recipeDiv.innerHTML += "<span class='" + components[i].innerHTML.toLowerCase() + "'>" + components[i].innerHTML + "</span>";

            }
            recipeDiv.innerHTML += "]";

            updateRecipeArray();
        }

        function updateComponentCountTable() {

            for (let x in componentCount) {
                document.getElementById(x + "ComponentCountCell").innerText = componentCount[x];
            }

        }

        function copyBodyStringButtonListener(e) {
            let recipeDiv = document.getElementById("bodyRecipeArray");

            if (bodyRecipeArray.length < 1) {
                console.log("Not copied");
                return;
            }
            let inp = document.createElement("input");
            inp.value = recipeDiv.innerText;

            document.getElementsByTagName("body")[0].appendChild(inp);

            inp.select();
            document.execCommand("Copy");

            document.getElementsByTagName("body")[0].removeChild(inp);
        }

        function resetComponentCountObject() {
            for (let x in componentCount) {
                componentCount[x] = 0;
            }
        }

        function updateProgressBar() {
            let progress = document.getElementById("progress");
            let percent = bodyRecipeArray.length * 2;
            progress.style.width = percent + "%";

            if (percent > 5) {
                progress.innerText = percent + "%";
            } else {
                progress.innerText = "";
            }
        }
    }

}());