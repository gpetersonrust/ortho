import { createPhysician, fetchPhysicians } from "./create-physician";

class SearchExperts {
  constructor(main_grid) {
    this.main_grid = document.querySelector(main_grid);
    this.secondary_grid = document.getElementById("offering-grid");
    this.secondary_text = document.getElementById("offering-text").querySelector('strong');
    this.sports_medicine_row = document.getElementById("sportsmedicine-row");
    this.spine_back_row = document.getElementById("spineneckback-row");
    this.filterSelects = [...document.querySelectorAll(".expert-filter")].slice(0, 2);
    this.filterSearch = document.querySelector(".expert-filter-search-box");
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

    this.filter = {
      location: 'all',
      specialty: 'all',
      name: 'all' // Be sure to change this on every page that uses dataset search
    };

    this.sports_medicine_row.style.display = "none";
    this.spine_back_row.style.display = "none";
    // display none offering grid 
    this.secondary_grid.style.display = "none";
    // display none offering text
    this.secondary_text.style.display = "none";
    this.init();
    this.events();
  }

  async init() {
      try {
        await this.setup_experts();
     
        this.getSportsMedicineRow();
        this.getSpineRow();
        
    } catch (error) {
      throw new Error(error);
    }
  }
    
   async  setup_experts() {
        this.main_grid.innerHTML = '';
        this.experts = await fetchPhysicians();
     this.filteredExperts = [];
     
     console.log(this.experts[0], 'experts');
  
        this.experts.forEach(expert => {
          let expertCard = createPhysician(expert);
          this.main_grid.appendChild(expertCard);
        });
        
    }
  getSportsMedicineRow(data) {
    this.sports_medicine_data = data.reduce((acc, expert) => {
        let specialty = expert.specialty;
        let isMedicine = expert.specialty.includes("sportsmedicine");
        let secondary_specialty = expert.secondary_specialty;
        let isMedicineSecondary = secondary_specialty .includes("sportsmedicine");
        let isSurgery = expert.surgery.toLowerCase() === 'yes'; 
        if (isMedicine) {
            if(isSurgery) {
                acc.sports_medicine_surgery.push(expert);
            } else {
                acc.sports_medicine_non_surgery.push(expert);
            }
        }

        if (isMedicineSecondary) {
            acc.sports_medicine_also_offering.push(expert);
        }

        return acc;
    }, {
        sports_medicine_surgery: [],
        sports_medicine_non_surgery: [],
        sports_medicine_also_offering: []
    }); 
      
      let sports_medicine_surgeon_row = document.getElementById("sports-medicine-surgeon");
    
      let non_surgeon_medicine_row = document.getElementById("non-sports-medicine-surgeon");
      //   add classlist physicians-grid-figma
      non_surgeon_medicine_row.classList.add('physicians-grid-figma');

    
      const { sports_medicine_surgery, sports_medicine_non_surgery, sports_medicine_also_offering } = this.sports_medicine_data;
      sports_medicine_surgeon_row.innerHTML = '';
        sports_medicine_surgery.forEach(expert => {
            let expertCard = createPhysician(expert);
            sports_medicine_surgeon_row.appendChild(expertCard);
        });
      non_surgeon_medicine_row.innerHTML = '';
        sports_medicine_non_surgery.forEach(expert => {
            let expertCard = createPhysician(expert);
            non_surgeon_medicine_row.appendChild(expertCard);
        });
    
      
}

    getSpineRow(data) { 
        this.spine_back_data = data.reduce((acc, expert) => {
            let specialty = expert.specialty;
 
            let isMedicine = specialty.includes("spineneckback");
            let secondary_specialty = expert.secondary_specialty;
            let isMedicineSecondary = secondary_specialty .includes("spineneckback");
            let isSurgery = expert.surgery.toLowerCase() === 'yes'; 
            if (isMedicine) {
                if(isSurgery) {
                    acc.spine_back_surgery.push(expert);
                } else {
                    acc.spine_back_non_surgery.push(expert);
                }
            }
    
            if (isMedicineSecondary) {
                acc.spine_back_also_offering.push(expert);
            }
    
            return acc;
        }, {
            spine_back_surgery: [],
            spine_back_non_surgery: [],
            spine_back_also_offering: []
        }); 
          
          let spine_back_surgeon_row = document.getElementById("spine-back-surgeon");
        
          let spine_back_non_surgeon_row = document.getElementById("spine-back-non-surgeon");
          //   add classlist physicians-grid-figma
          spine_back_non_surgeon_row.classList.add('physicians-grid-figma');
    
        
          const { spine_back_surgery, spine_back_non_surgery, spine_back_also_offering } = this.spine_back_data;
          spine_back_surgeon_row.innerHTML = '';
            spine_back_surgery.forEach(expert => {
                let expertCard = createPhysician(expert);
                spine_back_surgeon_row.appendChild(expertCard);
            });
          spine_back_non_surgeon_row.innerHTML = '';
            spine_back_non_surgery.forEach(expert => {
                let expertCard = createPhysician(expert);
                spine_back_non_surgeon_row.appendChild(expertCard);
            });
    }

  events() {
    this.filterSelects.forEach(select => {
      select.addEventListener("change", (e) => {
        const active_pargraph_selector = () => {
            if (this.activePargraph) this.activePargraph.style.display = "none";
            this.activePargraph = null;
          let id = this.option_values_to_text_ids[e.target.value];
            this.activePargraph = document.getElementById(id);
            
            if(this.activePargraph) this.activePargraph.style.display = "block";
        };
          const correct_row = () => {
              if (e.target.value === 'sportsmedicine') {
                  this.sports_medicine_row.style.display = "block";
                  this.spine_back_row.style.display = "none";
                  this.main_grid.style.display = "none";
              } else if (e.target.value === 'spineneckback') {
                  this.sports_medicine_row.style.display = "none";
                  this.spine_back_row.style.display = "block";
                    this.main_grid.style.display = "none";
              } else {
                  this.sports_medicine_row.style.display = "none";
                  this.spine_back_row.style.display = "none";
                    this.main_grid.style.display = "grid";
              }
          };
          
          
        // dataset fliter group 
        let key = e.target.dataset.filterGroup;

        this.filter[key] = e.target.value;
        if (key === 'specialty') {
            active_pargraph_selector();
            
            correct_row();

        }
          
      

        this.filterExperts();
      });
    });

    this.filterSearch.addEventListener("input", (e) => {
      this.filter.name = e.target.value;
      this.filterExperts();
    });
  }

    filterExperts() {
        this.filteredExperts = []; 
        this.secondFilteredExperts = [];
        this.experts.forEach(expert => {
            let specialty = expert.specialty;
            let secondary_specialty = expert.secondary_specialty;
            let location = expert.location;
            let name = expert.name;
       
            const isFound = (key) => {
           
                let found = false;
                let filterValue = this.filter[key].trim().toLowerCase();

                let expertValue = expert[key];


           
                if (filterValue === 'all' || filterValue === '' || filterValue === 'all locations') {
                    found = true;
                } else {
                    // if expertValue is an array then do include check
                    if (Array.isArray(expertValue)) {
                        found = expertValue.includes(filterValue);
                    } else {
                        // do regex check 
                        let regex = new RegExp(filterValue, 'gi');
                        found = expertValue.match(regex);
                    }
                }
                return found;
            }

            let locationFound = isFound('location');
         
            // if no location skip to next iteration
            if (!locationFound) return;
            console.log(locationFound, 'locationFound');
            let nameFound = isFound('name');
            // // if no name skip to next iteration
            if (!nameFound) return;
           
      
        
            if (this.filter.specialty === 'all') {
                this.filteredExperts.push(expert);
            } else if (specialty.includes(this.filter.specialty)) {
                this.filteredExperts.push(expert);
            } else if (secondary_specialty.includes(this.filter.specialty)) {
                this.secondFilteredExperts.push(expert);
            }
        });
        

    this.main_grid.innerHTML = '';
    this.filteredExperts.forEach(expert => {
      let expertCard = createPhysician(expert);
      this.main_grid.appendChild(expertCard);
    });

        // sports medicine grid
        this.getSportsMedicineRow(this.filteredExperts);   
        // spine back grid
        this.getSpineRow(this.filteredExperts);    
       
        // the offering grid 
        if (this.secondFilteredExperts.length > 0) {
            this.secondary_grid.innerHTML = '';
            this.secondFilteredExperts.forEach(expert => {
                let expertCard = createPhysician(expert);
                this.secondary_grid.appendChild(expertCard);
                this.secondary_grid.style.display = "grid";
                // display offering text
                this.secondary_text.style.display = "block";
                // set offering text 
                this.secondary_text.innerHTML = `Physicians also offering  ${this.filter.specialty}`;
            });
        } else {
            this.secondary_grid.innerHTML = '';
            this.secondary_grid.style.display = "none";
            // display none offering text
            this.secondary_text.style.display = "none";
        }
      
    
  }
}
export default SearchExperts;
