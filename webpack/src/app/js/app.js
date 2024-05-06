import { expert_dummy } from "../../data/dummy";
import "../scss/app.scss"; // Importing SCSS file
import SearchExperts from "../utilities/SearchExperts";
import { fetchPhysicians } from "../utilities/create-physician";
class LocationGrid {
  constructor() {
    this.filterButtons = document.querySelectorAll(".location-filter-button");
    this.gridItems = [...document.querySelectorAll(".location-grid-item")];
    this.itemsToUse = [];
    this.itemsToNotUse = [];
    this.activeTab;
    this.parentGrid = document.getElementById("main-grid");
    this.filterButtons.forEach(
      (button) => (button.onclick = this.filterButtonHandler.bind(this))
    );

    window.addEventListener("resize", this.handleResize.bind(this));
  }


  hideItems(items) {
    items.forEach((item) => {
      item.classList.remove("see_location");
      item.classList.add("hide_location");
    });
  }

  getComputedStyleValue(element, property) {
    return parseInt(
      window.getComputedStyle(element).getPropertyValue(property)
    );
  }

  gridSizeAndColumnWidth(items) {
    this.locationGrid = document.querySelector(".location-grid");
    const gridWidth = this.locationGrid.offsetWidth;
    const referenceItem = items[0];

    let marginTop = this.getComputedStyleValue(referenceItem, "margin-top");
    let marginBottom = this.getComputedStyleValue(
      referenceItem,
      "margin-bottom"
    );
    let marginY = marginTop > marginBottom ? marginTop : marginBottom;

    let marginLeft = this.getComputedStyleValue(referenceItem, "margin-left");
    let marginRight = this.getComputedStyleValue(referenceItem, "margin-right");
    let marginX = marginLeft > marginRight ? marginLeft : marginRight;

    let columnWidth = referenceItem.offsetWidth;
    let columns = Math.floor(gridWidth / columnWidth);

    let numRows = Math.ceil(items.length / columns);

    let gridHeight = numRows * (referenceItem.offsetHeight + marginY);

    return { columns, columnWidth, margin: marginY, gridHeight };
  }

  placeItemsInCorrectPosition(items, columns, columnWidth, margin, gridHeight) {
    // randomize the order of the items
    let random_items = items.sort(() => Math.random() - 0.5);

    random_items.forEach((item, index) => {
      let row = Math.floor(index / columns);
      let col = index % columns;

      let left = col * (columnWidth + margin);
      let top = row * (item.offsetHeight + margin);

      item.classList.remove("hide_location");
      item.classList.add("see_location");

      item.style.left = left + "px";
      item.style.top = top + "px";
    });

    this.locationGrid = document.querySelector(".location-grid");
    this.locationGrid.style.height = gridHeight + "px";
    this.locationGrid.style.position = "relative";
  }

  initGrid() {
    // filter item with main
    this.initItems = this.gridItems.filter((item) =>
      item.dataset.service.match(/main|surgery/)
    );
    this.hideItems(
      this.gridItems.filter(
        (item) => !item.dataset.service.match(/main|surgery/)
      )
    );

    const { columns, columnWidth, margin, gridHeight } =
      this.gridSizeAndColumnWidth(this.initItems);
    this.placeItemsInCorrectPosition(
      this.initItems,
      columns,
      columnWidth,
      margin,
      gridHeight
    );
  }

  filterButtonHandler(e) {
    const identifier = e.target.id;
    this.activeTab && this.activeTab.classList.remove("filter_button_clicked");

    this.itemsToUse = this.gridItems.filter((item) =>
      item.dataset.service.match(identifier)
    );
    this.itemsToNotUse = this.gridItems.filter(
      (item) => !item.dataset.service.match(identifier)
    );

    this.hideItems(this.itemsToNotUse);

    const { columns, columnWidth, margin, gridHeight } =
      this.gridSizeAndColumnWidth(this.itemsToUse);
    this.placeItemsInCorrectPosition(
      this.itemsToUse,
      columns,
      columnWidth,
      margin,
      gridHeight
    );
    this.activeTab = e.target;
    this.activeTab.classList.add("filter_button_clicked");
  }

  handleResize() {
    setTimeout(() => {
      if (this.itemsToUse.length > 0) {
        const { columns, columnWidth, margin, gridHeight } =
          this.gridSizeAndColumnWidth(this.itemsToUse);
        this.placeItemsInCorrectPosition(
          this.itemsToUse,
          columns,
          columnWidth,
          margin,
          gridHeight
        );
       
      }
    }, 500);
  }
}

// Instantiate the class
const locationGridInstance = new LocationGrid();

let export_grid_items = [...document.querySelectorAll(".physician-card")];
let converted_grid_items = export_grid_items.map((item) => {
  const { location, specialty, title: name} = item.dataset;
  return {
    element: item,
    location,
    specialty,
    name,
  };
});

class ExpertGrid {
  constructor(grid_items) {
    this.grid_items = grid_items || [];
    this.filteredItems = [];
    this.secondary_filter_items = [];
    this.secondary_grid = document.getElementById("offering-grid");
    this.secondary_text = document.getElementById("offering-text").querySelector('strong');

   

    this.sports_medicine_row = document.getElementById("sportsmedicine-row");
    this.spine_back_row = document.getElementById("spineneckback-row");
    this.all_experts_rows = document.getElementById("all-experts-row");

  this.sports_medicine_row.style.display = "none";
    this.spine_back_row.style.display = "none";

    this.filterSelects = [...document.querySelectorAll(".expert-filter")].slice(
      0,
      2
    );

    this.filterSearch = document.querySelector(".expert-filter-search-box");

    this.parentGrid = document.getElementById("expert-grid-parent");
    this.location = "";
    this.specialty = "";
    this.name = "";
    this.timer = null;
    //  get specialty from url
    const urlParams = new URLSearchParams(window.location.search);
    const specialty = urlParams.get("specialty");
    this.initValue = specialty;
    this.option_values_to_text_ids = {
      all: false,
      footankle: "foot-ankle-x",
      generalorthopaedics: "general-orthopeadics-x",
      handwrist: "hand-wrist-x",
      hipknee: "hip-x",
      oncology: "oncology-x",
      pediatric: "pediatric-x",
      shoulder: "shoulder-x",
      spineneckback: "spine-neck-back-x",
      sportsmedicine: "sports-medicine-x",
      trauma: "trauma-x",
    };

    this.activePargraph = null;

    this.events();
    this.init();
  }

  convert_grid_item(grids) {
    return [...grids].map((item) => {
      const { location, specialty, name } = item.dataset;
      return {
        element: item,
        location,
        specialty,
        name,
      };
    });
  }

  init() {
    if (this.initValue) {
      this.specialty = this.initValue;
      this.filterGridItems();
      this.filterSecondaryItems();
      // id="specialty-dropdown" change section to option that matches this.initValue
      const specialtyDropdown = document.getElementById("specialty-dropdown");
      const specialtyOptions = [...specialtyDropdown.options];
      const specialtyOption = specialtyOptions.find(
        (option) => option.value === this.initValue
      );
      specialtyOption.selected = true;

      // hide active paragraph if there is one
      this.activePargraph &&
        (this.activePargraph.style.display = "none") &&
        (this.activePargraph = null);
      this.option_values_to_text_ids[this.initValue]
        ? (this.activePargraph = document.getElementById(
            this.option_values_to_text_ids[this.initValue]
          ))
        : (this.activePargraph = null);

      this.activePargraph && (this.activePargraph.style.display = "block");

      this.dynamically_choose_correct_container_to_display(this.initValue);
    }

    // display none on all secondary filter items
    this.secondary_grid.style.display = "none";
    this.secondary_text.style.display = "none";
  }

  events() {
    this.filterSelects.forEach(
      (select) => (select.onchange = this.filterSelectHandler.bind(this))
    );
    this.filterSearch.onkeyup = this.filterSearchHandler.bind(this);

    this.select_opt_group = document.getElementById("specialty-dropdown");
   }
  filterSelectHandler(e) {
    let element = e.target;
    const filter_value = e.target.value;
    let filter_key = e.target.dataset.filterGroup;
    this[filter_key] = filter_value;

    if (filter_key === "specialty") {


      // hide active paragraph if there is one
      this.activePargraph && (this.activePargraph.style.display = "none");
      this.option_values_to_text_ids[filter_value]
        ? (this.activePargraph = document.getElementById(
            this.option_values_to_text_ids[filter_value]
          ))
        : (this.activePargraph = null);

      this.activePargraph && (this.activePargraph.style.display = "block");

      this.dynamically_choose_correct_container_to_display(filter_value);
      this.dynamically_choose_which_secondary_filter_to_display(filter_value);
    }


    this.filterGridItems();
    this.filterSecondaryItems();
  //  scroll element into view

  }



  dynamically_choose_correct_container_to_display(filter_value) {
    if (filter_value === "sportsmedicine") {
      this.sports_medicine_row.style.display = "flex";
      this.spine_back_row.style.display = "none";
      this.all_experts_rows.style.display = "none";
    } else if (filter_value === "spineneckback") {
      this.sports_medicine_row.style.display = "none";
      this.spine_back_row.style.display = "flex";
      this.all_experts_rows.style.display = "none";
    } else {
      this.sports_medicine_row.style.display = "none";
      this.spine_back_row.style.display = "none";
      this.all_experts_rows.style.display = "flex";
    }
  }

  dynamically_choose_which_secondary_filter_to_display(filter_value) {
    const specialtyObject = {
      all: '',
      footankle: 'Physicians also offering Foot & Ankle Procedures',
      generalorthopaedics: 'Physicians also offering General Orthopaedics Procedures',
      handwrist: 'Physicians also offering Hand & Wrist Procedures',
      hipknee: 'Physicians also offering Hip & Knee Replacement Procedures',
      oncology: 'Physicians also offering Oncology Procedures',
      pediatric: 'Physicians also offering Pediatric Procedures',
      shoulder: 'Physicians also offering Shoulder & Elbow Procedures',
      spineneckback: 'Physicians also offering Spine (Neck & Back) Procedures',
      sportsmedicine: 'Physicians also offering Sports Medicine Procedures',
      trauma: 'Physicians also offering Trauma Procedures'
    };
    
    this.secondary_text.innerHTML = specialtyObject[filter_value];
    
  }
  filterSearchHandler(e) {
    // debounce
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const search_value = e.target.value;
      this.name = search_value;
      this.filterGridItems();
      this.filterSecondaryItems();
      // loop through and remove duplicates based on name
    }, 1000);
  }
// Utility function to check if an item matches the given criteria
matchesCriteria(item, isSecondaryFilter = false) {
  const locationRegex = new RegExp(this.location, "i");
  const specialtyRegex = new RegExp(this.specialty, "i");
  const nameRegex = new RegExp(this.name, "i");

  const { location, specialty, name } = item;
  const locationMatch = this.location.toLowerCase() === "all locations" || location.match(locationRegex);
  let  specialtyMatch;  
    if(isSecondaryFilter) {
      let secondarySpecailty =  item.element.dataset.secondarySpecialty || '';
      if(!secondarySpecailty) {
        specialtyMatch = false;
      } else {
        specialtyMatch  = this.specialty.toLowerCase() === "all" || secondarySpecailty.match(specialtyRegex);
      }
      
    } else {
    specialtyMatch  = this.specialty.toLowerCase() === "all" || specialty.match(specialtyRegex);

    }

  const nameMatch = this.name.toLowerCase() === "" || name.match(nameRegex);

  return locationMatch && specialtyMatch && nameMatch;
}

// Primary filtering
filterGridItems() {
  this.filteredItems = this.grid_items.filter((item) => {
    const isMatched = this.matchesCriteria(item);
    let parent = item.element.closest('.physician-card-container');
    if (isMatched) {
      // parent container physician-card-container 
 
      parent.classList.add("see_expert");
      parent.classList.remove("hide_expert");
    } else {
      parent.classList.add("hide_expert");
      parent.classList.remove("see_expert");
    }

    return isMatched;
  });
}

// Secondary filtering
  filterSecondaryItems() {
  
    // log filter options 
   
 
  if( this.specialty == 'all' || this.specialty == "") {
    this.secondary_grid.style.display = "none";
    this.secondary_text.style.display = "none";
  return;
  }
  this.secondary_filter_items = this.grid_items.reduce((filtered, item) => {
    const isMatched = this.matchesCriteria(item, true);

    if (isMatched) {
      let clone = item.element.cloneNode(true);
      clone.classList.add("see_expert");
      clone.classList.remove("hide_expert");
      // check of clone is already in filtered by checking ids
      const alreadyInFiltered = filtered.find((item) => item.id === clone.id);
      if (!alreadyInFiltered){
      filtered.push(clone);
      }
    }

    return filtered;
  }, []);

  this.secondary_grid.innerHTML = "";

  
  if(this.secondary_filter_items.length !== 0) {
    this.secondary_grid.style.display = "flex";
    this.secondary_text.style.display = "block";
     this.secondary_filter_items.forEach((item) => {
      this.secondary_grid.appendChild(item);
      
    });
  } else {
    this.secondary_grid.style.display = "none";
    this.secondary_text.style.display = "none";
  }   
 

 }

   

  updateGrid() {
  
    this.parentGrid.innerHTML = "";

    console.log(this.parentGrid, 'update');
    if (this.filteredItems.length !== 0) {
      this.filteredItems.forEach((item) => {
        this.parentGrid.appendChild(item.element);
      });
    } else {
      //    no results

      const noResults = document.createElement("div");
      noResults.classList.add("no-results");
      noResults.innerHTML = "<h2>No Results Found</h2>";
      this.parentGrid.appendChild(noResults);
    }

   
  }
  
}

// if (export_grid_items.length > 0) {
//   const expertGridInstance = new ExpertGrid(converted_grid_items);
// }


new SearchExperts('#main-grid');
 


