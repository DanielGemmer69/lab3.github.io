"use strict";

let order = [];

window.addEventListener("load", () =>{
    createMenu();
    let menuItems = document.querySelectorAll(".menuItem");
    menuItems.forEach(menuItem => {
        menuItem.addEventListener("click", openMenu);
        let itemButton = menuItem.querySelector("button");
        itemButton.addEventListener("click", addToOrder);
    });
    let dropdown = document.querySelector(".arrowCont");
    dropdown.addEventListener("click", openDropdown)
});

function createOrderSummary()
{
    let dropdown = document.getElementById("dropdown");
    dropdown.innerHTML = ""; //tömmer den om det råkade ligga något där tidigare

    order.forEach(function(orderItem, index){
        let article = document.createElement('article');
        article.classList.add('orderSummary');
        article.setAttribute("id", index);
        article.addEventListener("click", removeFromSummary)
    
        let div1 = document.createElement('div');
        let h3 = document.createElement('h3');
        h3.textContent = orderItem.name;
        div1.append(h3);

        if(orderItem.removedItems !== '')
        {
            if(orderItem.removedItems !== undefined && orderItem.removedItems != '')
            {
                let p = document.createElement('p');
                p.textContent = 'Utan:';
                let ul = document.createElement('ul');

                orderItem.removedItems.forEach(item =>{
                    let li = document.createElement('li');
                    li.innerHTML = item;
                    ul.append(li);
                });

                div1.append(p);
                div1.append(ul);

            }
            if(orderItem.comment != '')
            {
                let p2 = document.createElement('p');
                p2.textContent = "Anteckningar:"
                let span = document.createElement('span');

                span.append(orderItem.comment);
                div1.append(p2);
                div1.append(span)
            }

            let div2 = document.createElement('div');
            let span = document.createElement('span');
            span.textContent = orderItem.price + "kr";
            let button = document.createElement('button');
            button.textContent = 'Ta bort';
            div2.append(span);
            div2.append(button);
            article.append(div1);
            article.append(div2);
         
            let dropdown = document.getElementById("dropdown");
            dropdown.append(article);
        }
    });
}

function removeFromSummary(event)
{
    if(event.target.tagName === 'BUTTON')
    {
        let id = event.currentTarget.getAttribute("id");
        order.splice(id, 1);
        event.currentTarget.removeEventListener("click", removeFromSummary);
        event.currentTarget.remove();
        createOrderSummary();

        let totalSum = 0;
        order.forEach(orderItem =>{
            totalSum += parseFloat(orderItem.price);
        });
        let totalSumH3 = document.getElementById("price");
        totalSumH3.textContent = totalSum;
        let articlesH3 = document.getElementById("articles");
        articlesH3.textContent = order.length;
    }
}

function openDropdown(event)
{
    let dropdownCont = document.querySelector(".orderList");
    dropdownCont.style.height = "100%";
    event.currentTarget.querySelector("img").src = "source/down-arrow.png";
    let textContainer = dropdownCont.querySelector(".textContainer");
    textContainer.classList.add("fixedPosition");
    let orderButton = dropdownCont.querySelector(".orderButton");
    orderButton.style.marginRight = "15px";
    let nav = dropdownCont.querySelector("nav");
    nav.style.display = "none";
    createOrderSummary();
    event.currentTarget.removeEventListener("click", openDropdown);
    event.currentTarget.addEventListener("click", closeDropdown);
}

function closeDropdown(event)
{
    let dropdownCont = document.querySelector(".orderList");
    let dropdown = document.getElementById("dropdown");
    dropdownCont.style.height = "auto";
    event.currentTarget.querySelector("img").src = "source/up-arrow.png";
    dropdown.innerHTML = "";
    let orderButton = dropdownCont.querySelector(".orderButton");
    orderButton.style.marginRight = "0";
    let nav = dropdownCont.querySelector("nav");
    nav.style.display = "flex";
    let textContainer = dropdownCont.querySelector(".textContainer");
    textContainer.classList.remove("fixedPosition");
    event.currentTarget.removeEventListener("click", closeDropdown)
    event.currentTarget.addEventListener("click", openDropdown)
}

function openMenu(event)
{
    event.stopPropagation();
    let menuItem = event.currentTarget;
    if (event.target === menuItem || event.target.tagName === 'P' || event.target.tagName === 'SPAN' || event.target.tagName === 'H2')
    {
        let p = menuItem.querySelector("p");
        let checkbox = menuItem.querySelector(".checkboxes");
        
        if(menuItem.getAttribute("open") === "false") //stängd meny
        {
            if(p !== null) //kollar om det finns ingredienser, annars är det en dricka/sås
            {
                p.style.display = "none";
                checkbox.style.display = "flex";
            }
            menuItem.style.backgroundColor = "#f8d7da";
            menuItem.setAttribute("open", "true");
        }else //öppen meny
        {
            if(p !== null)
            {
                p.style.display = "block";
                checkbox.style.display = "none";
                let inputs = checkbox.querySelectorAll('input');
                for(let input of inputs)
                    input.checked = true; //resettar alla inputs
            }
            menuItem.style.backgroundColor = "#d1ecf1"
            menuItem.setAttribute("open", "false");
        }
    }
}

function addToOrder(event)
{
    event.stopPropagation()

    let menuItem = event.target.parentNode;
    let name = menuItem.querySelector("div h2").textContent;
    let price = menuItem.querySelector("div span").textContent;
    let inputs = menuItem.querySelectorAll("input[type='checkbox']");
    let removedItems = [];
    inputs.forEach(input =>{
        if(input.checked === false && input.value !== '')
            removedItems.push(input.value);
    });
    let comment = ""; 
    if(menuItem.querySelector("input[type='text']"))
        comment = menuItem.querySelector("input[type='text']").value;

    let orderedItem = {
        name: name,
        price: price,
        removedItems: removedItems,
        comment: comment
    };
    order.push(orderedItem);

    //räknar ut pris och antal artiklar
    let totalSum = 0;
    order.forEach(orderItem =>{
        totalSum += parseFloat(orderItem.price);
    });

    let totalSumH3 = document.getElementById("price");
    totalSumH3.textContent = totalSum;
    let articlesH3 = document.getElementById("articles");
    articlesH3.textContent = order.length;
}

function createMenu()
{
    for (let category in menu)
    {
        createTitle(category);
        menu[category].forEach(menuItem => {
            createMenuItem(menuItem);
        });
    } 
}

function createMenuItem(menuItem)
{
    var menu = document.getElementById("menu");
    const article = document.createElement('article');
    article.classList.add('menuItem');
    article.setAttribute("open", false);
    const div = document.createElement('div');

    //name
    const name = document.createElement('h2');
    name.textContent = menuItem.name;
    div.append(name);

    //ingredients
    if(menuItem.contents !== undefined) //om det finns ingredienser
    {
        //list of ingredients
        let ingredientList = document.createElement('p');
        let ingredients = menuItem.contents;
        ingredients.forEach((ingredientItem, index) =>{
            if (ingredientItem.includes("a:"))
            {
                ingredients[index] = ingredientItem.split(':')[1].bold();
            }
        });
        ingredientList.innerHTML = ingredients.join(', ');
        div.append(ingredientList);

        //checkbox of ingredients
        let checkboxCont = document.createElement('div');
        checkboxCont.classList.add("checkboxes");
        ingredients.forEach((ingredientItem) =>{
            let label = document.createElement("label");
            let input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("name", "ingredient");
            input.setAttribute("value", ingredientItem);
            input.checked = true;
            label.append(input);
            label.insertAdjacentHTML('beforeend', ingredientItem); //Används då append inte formaterar bold taggen korrekt och taggen skrivs ut som text
            checkboxCont.append(label);
            checkboxCont.style.display = "none"
        });

        //info to chef
        let label = document.createElement("label");
        let input = document.createElement("input");
        input.setAttribute("type", "text");
        label.textContent = "Info till kocken";
        label.append(input);
        checkboxCont.append(label);

        div.append(checkboxCont);

    }
    
    //price
    const price = document.createElement('span');
    price.textContent = menuItem.price;
    div.append(price);
    
    const button = document.createElement('button');
    button.textContent = 'Lägg till';
    
    article.append(div);
    article.append(button);
    menu.append(article);
}

function createTitle(TitleText)
{
    var menu = document.getElementById("menu");
    var titleCont = document.createElement("div");
    titleCont.classList.add("menuTitle");
    var title = document.createElement("h1");
    title.setAttribute("id", TitleText);
    title.textContent = TitleText;
    titleCont.append(title);
    menu.append(titleCont);
}

function resetMenuItem(menuItem)
{
    let checkbox
}