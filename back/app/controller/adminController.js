const {Wine, GrapeVariety, Style, Culture, Dish} = require('../models');
const { escape } = require('sanitizer');

const adminController = {

	/** @function 
   * Create wine in database
   * @param {String} name- wine's name
   * @param {String} description - wine's description
   * @param {String} appellation - wine's appellation
   * @param {String} size- wine bottle's size
   * @param {Number} alcohol - wine's alcohol
   * @param {Number} vintage - wine's vintage
   * @param {String} color - wine's color
   * @param {String} avatar- wine's image
   * @param {Number} region_id - wine region's id
   * @param {Number} winemaker_id - wine region's id
   */
	async createWine(req, res){
		try {
    
			const { name, description, appellation, size, price, alcohol, vintage, color, avatar, region_id, winemaker_id} = req.body;
    
			if (!name || name.trim() === '') {
				const error = new Error('"name" property is missing');
				return res.status(400).json({ message: error.message });
			}
			if (!description || description.trim() === '') {
				const error = new Error('"description" property is missing');
				return res.status(400).json({ message: error.message });
			}
			if (!appellation || appellation.trim() === '') {
				const error = new Error('"appellation" property is missing');
				return res.status(400).json({ message: error.message });
			}
			if (!size || size.trim() === '') {
				const error = new Error('"size" property is missing');
				return res.status(400).json({ message: error.message });
			}
			if (!color || color.trim() === '') {
				const error = new Error('"color" property is missing');
				return res.status(400).json({ message: error.message });
			}
			if (!price) {
				const error = new Error('"price" property is missing');
				return res.status(400).json({ message: error.message });
			}
			if (!alcohol) {
				const error = new Error('"alcohol" property is missing');
				return res.status(400).json({ message: error.message });
			}
			if (!vintage) {
				const error = new Error('"vintage" property is missing');
				return res.status(400).json({ message: error.message });
			}
			if (!avatar || avatar.trim() === '') {
				const error = new Error('"avatar" property is missing');
				return res.status(400).json({ message: error.message });
			}
			if (!winemaker_id) {
				const error = new Error('"winemaker_id" property is missing');
				return res.status(400).json({ message: error.message });
			}
			if (!region_id) {
				const error = new Error('"region_id" property is missing');
				return res.status(400).json({ message: error.message });
			}
    
			const newWine = Wine.build({
				name : escape(name.trim()), 
				description : escape(description.trim()), 
				appellation,
				size, 
				price : escape(price),
				alcohol: escape(alcohol), 
				vintage : escape(vintage), 
				color : color.trim(),  
				avatar : avatar.trim(), 
				region_id, 
				winemaker_id
			});
            
			await newWine.save();
			res.status(201).json(newWine);
            
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: error.message });
		}
	}, 
    
	/** @function 
   * Update wine in database
   * @param {Number} id- wine's id
   * @param {String} [name] - wine's name
   * @param {String} [description] - wine's description
   * @param {String} [appellation] - wine's appellation
   * @param {String} [size] - wine bottle's size
   * @param {Number} [alcohol] - wine's alcohol
   * @param {Number} [vintage] - wine's vintage
   * @param {String} [color] - wine's color
   * @param {String} [avatar] - wine's image
   * @param {Number} [region_id] - wine region's id
   * @param {Number} [winemaker_id] - wine region's id
   */
	async updateWineById(req,res){
		try{
			const wineId = Number(req.params.id); 
			const {name, description, appellation, size, price, alcohol, vintage, color, avatar, region_id, winemaker_id} = req.body; 
    
			const wine = await Wine.findByPk(wineId); 
    
			if(!wine){
				const error = new Error(`Wine with id ${wineId} does not exist`); 
				return res.status(404).json({ message: error.message });
			}
    
			if (name || name.trim() === '') {
				wine.name = escape(name);
			}
			if (description || description.trim() === '') {
				wine.description = escape(description); 
			}
			if (appellation || appellation.trim() === '') {
				wine.appellation = appellation;
			}
			if (size) {
				wine.size = size;  
			}
			if (color) {
				wine.color = color;  
			}
			if (price) {
				wine.price = escape(price);  
			}
			if (Number(alcohol)) {
				wine.alcohol = escape(alcohol);  
			}
			if (vintage) {
				wine.vintage = escape(vintage);  
			}
			if (avatar) {
				wine.avatar = avatar;  
			}
			if (winemaker_id) {
				wine.winemaker_id = winemaker_id;
			}
			if (region_id) {
				wine.region_id = region_id;
			}
    
			await wine.save();
			res.status(200).json(wine);
		}catch(error){
			console.error(error);
			res.status(500).json({ message: error.message });
		}
	}, 
    
	/** @function 
   * delete wine in database
   * @param {Number} id- wine's id
   */
	async deleteWineById(req,res){
		try{
			const wineId = Number(req.params.id);
			const wine = await Wine.findByPk(wineId);
    
			if (!wine) {
				const error = new Error(`Wine with id ${wineId} not found.`);
				return res.status(404).json({ message: error.message });
			}
    
			await wine.destroy();
			res.status(200).json(wine);
            
		}catch(error){
			console.error(error);
			res.status(500).json({ message: error.message });	
		}
	}, 

	/** @function 
   * associate grapevariety to wine
   * @param {Array} id- grapevariety's id in array
   */
	async associateGrapeVarietyToWine(req,res){
		try{

			const wineId = Number(req.params.id); 
			const { grapeVarietyIdList } = req.body;
		
			let wine = await Wine.findByPk(wineId, {
				include : 'grapevarieties', 
			}); 

			if(!wine) {
				const error = new Error(`Wine with id ${wineId} does not exist.`); 
				return res.status(404).json({message : error.message}); 
			}

			let grapevarietyList = []; 
			for ( const id of grapeVarietyIdList ){
				const grapevariety = await GrapeVariety.findByPk(id);
				if(!grapevariety){
					const error = new Error(`GrapeVariety with id ${id} does not exist.`); 
					return res.status(404).json({message : error.message}); 
				}
				grapevarietyList.push(grapevariety);
			}
			
			await wine.addGrapevariety(grapevarietyList); 

			wine = await Wine.findByPk(wineId, {
				include : 'grapevarieties'
			}); 

			res.status(201).json(wine); 

		}catch(error){
			console.error(error); 
			res.status(500).json({message : error.message}); 
		}
	}, 

	/** @function 
   * associate style to wine
   * @param {Array} id- style's id in array
   */
	async associateStyleToWine(req,res){
		try{

			const wineId = Number(req.params.id); 
			const { styleIdList } = req.body;
			
			
			let wine = await Wine.findByPk(wineId, {
				include : 'styles', 
			}); 
	
			if(!wine) {
				const error = new Error(`Wine with id ${wineId} does not exist.`); 
				return res.status(404).json({message : error.message}); 
			}
	
			let styleList = []; 
			for ( const id of styleIdList ){
				const style = await Style.findByPk(id);
				if(!style){
					const error = new Error(`Style with id ${id} does not exist.`); 
					return res.status(404).json({message : error.message}); 
				}
				styleList.push(style);
			}
				
			await wine.addStyle(styleList); 
	
			wine = await Wine.findByPk(wineId, {
				include : 'styles'
			}); 
	
			res.status(201).json(wine); 
	
		}catch(error){
			console.error(error); 
			res.status(500).json({message : error.message}); 
		}
	}, 

	/** @function 
   * associate culture to wine
   * @param {Array} id- culture's id in array
   */
	async associateCultureToWine(req,res){
		try{

			const wineId = Number(req.params.id); 
			const cultureIdList  = req.body.cultureIdList;
 
			let wine = await Wine.findByPk(wineId, {
				include : 'culture', 
			}); 

	
			if(!wine) {
				const error = new Error(`Wine with id ${wineId} does not exist.`); 
				return res.status(404).json({message : error.message}); 
			}
	
			let cultureList = []; 
			for ( const id of cultureIdList){
				const culture = await Culture.findByPk(id);
				if(!culture){
					const error = new Error(`Culture with id ${id} does not exist.`); 
					return res.status(404).json({message : error.message}); 
				}
				cultureList.push(culture);
			}
				
			await wine.addCulture(cultureList); 
	
			wine = await Wine.findByPk(wineId, {
				include : 'culture'
			}); 
	
			res.status(201).json(wine); 
	

		}catch(error){
			console.error(error); 
			res.status(500).json({message : error.message}); 
		}
	}, 

	/** @function 
   * associate dish to wine
   * @param {Array} id- dish's id in array
   */
	async associateDishToWine(req,res){
		try{

			const wineId = Number(req.params.id); 

			const { dishIdList } = req.body;
		
			let wine = await Wine.findByPk(wineId, {
				include : 'dishes', 
			}); 
		
			if(!wine) {
				const error = new Error(`Wine with id ${wineId} does not exist.`); 
				return res.status(404).json({message : error.message}); 
			}
		
			let dishList = []; 
			for ( const id of dishIdList ){
				const dish = await Dish.findByPk(id);
				if(!dish){
					const error = new Error(`Dish with id ${id} does not exist.`); 
					return res.status(404).json({message : error.message}); 
				}
				dishList.push(dish);
			}
					
			await wine.addDish(dishList); 
		
			wine = await Wine.findByPk(wineId, {
				include : 'dishes'
			}); 
		
			res.status(201).json(wine); 
		
		}catch(error){
			console.error(error); 
			res.status(500).json({message : error.message}); 
		}
	}, 

	/** @function 
   	* remove or add grapevariety to wine
   	* @param {Array} id- grapevariety's id in array
   	*/
	async removeGrapeVarietyToWine(req, res){
		try {
			

			const wineId = Number(req.params.id); 

			const { grapeVarietyIdList } = req.body;

			let wine = await Wine.findByPk(wineId, {
				include : 'grapevarieties'
			});

			//1. Retrieve grapevariety's ids already present on wine and store it in array
			let initialGrapeVarietyIdList = wine.grapevarieties.map(item => item.id);
			//2. Retrieve grapevariety's ids common to wine and grapeVarietyIdList
			let commonGrapeVarietyIdList = grapeVarietyIdList.filter(item => initialGrapeVarietyIdList.includes(item)); // id en commun

			//3. For the ids of grapeVarietyIdList that are not incommunGrapeVarietyIdList, 
			// we look for the corresponding grape variety in the database and we add them in an array 
			let grapevarietiesToAdd = []; 
			for(let item of grapeVarietyIdList){
				if(!commonGrapeVarietyIdList.includes(item)){
					const grapevariety = await GrapeVariety.findByPk(item);
					if(!grapevariety){
						const error = new Error(`GrapeVariety with id ${item} does not exist.`); 
						return res.status(404).json({message : error.message}); 
					}
					grapevarietiesToAdd.push(grapevariety); 
				}
			}


			//4. For the ids of initialGrapeVarietyIdList that are not in communGrapeVarietyIdList
			// we look for the corresponding grape varieties in the database and add them to an array
			let grapevarietiesToRemove = []; 
			for(let item of initialGrapeVarietyIdList){
				if(!commonGrapeVarietyIdList.includes(item)){
					const grapevariety = await GrapeVariety.findByPk(item);
					if(!grapevariety){
						const error = new Error(`GrapeVariety with id ${item} does not exist.`); 
						return res.status(404).json({message : error.message}); 
					}
					grapevarietiesToRemove.push(grapevariety); 
				}
			}

			await wine.addGrapevariety(grapevarietiesToAdd); 
			await wine.removeGrapevariety(grapevarietiesToRemove);

			wine = await Wine.findByPk(wineId, {
				include: 'grapevarieties',
			});

			res.status(200).json(wine);

		} catch (error) {
			console.error(error);
			res.status(500).json({ message: error.message });
		}
	}, 

	/** @function 
   	* remove or add style to wine
   	* @param {Array} id- style's id in array
   	*/
	async removeStyleToWine(req, res){
		try {
			

			const wineId = Number(req.params.id); 

			const { styleIdList } = req.body;

			let wine = await Wine.findByPk(wineId, {
				include : 'styles'
			});

		
			let initialStyleIdList = wine.styles.map(item => item.id);
			let commonStyleIdList = styleIdList.filter(item => initialStyleIdList.includes(item));
			
			let styleToAdd = []; 
			for(let item of styleIdList){
				if(!commonStyleIdList.includes(item)){
					const style = await Style.findByPk(item);
					if(!style){
						const error = new Error(`Style with id ${item} does not exist.`); 
						return res.status(404).json({message : error.message}); 
					}
					styleToAdd.push(style); 
				}
			}

			let styleToRemove = []; 
			for(let item of initialStyleIdList){
				if(!commonStyleIdList.includes(item)){
					const style = await Style.findByPk(item);
					if(!style){
						const error = new Error(`Style with id ${item} does not exist.`); 
						return res.status(404).json({message : error.message}); 
					}
					styleToRemove.push(style); 
				}
			}

			await wine.addStyle(styleToAdd); 
			await wine.removeStyle(styleToRemove);

			wine = await Wine.findByPk(wineId, {
				include: 'styles',
			});

			res.status(200).json(wine);

		} catch (error) {
			console.error(error);
			res.status(500).json({ message: error.message });
		}
	}, 

	/** @function 
   	* remove or add culture to wine
   	* @param {Array} id- culture's id in array
   	*/
	async removeCultureToWine(req, res){
		try {
			

			const wineId = Number(req.params.id); 

			const { cultureIdList } = req.body;

			let wine = await Wine.findByPk(wineId, {
				include : 'culture'
			});


			let initialCultureIdList = wine.culture.map(item => item.id);
			let commonCultureIdList = cultureIdList.filter(item => initialCultureIdList.includes(item));
	
			let cultureToAdd = []; 
			for(let item of cultureIdList){
				if(!commonCultureIdList.includes(item)){
					const culture = await Culture.findByPk(item);
					if(!culture){
						const error = new Error(`Culture with id ${item} does not exist.`); 
						return res.status(404).json({message : error.message}); 
					}
					cultureToAdd.push(culture); 
				}
			}

			let cultureToRemove = []; 
			for(let item of initialCultureIdList){
				if(!commonCultureIdList.includes(item)){
					const culture = await Culture.findByPk(item);
					if(!culture){
						const error = new Error(`Culture with id ${item} does not exist.`); 
						return res.status(404).json({message : error.message}); 
					}
					cultureToRemove.push(culture); 
				}
			}

			await wine.addCulture(cultureToAdd); 
			await wine.removeCulture(cultureToRemove);

			wine = await Wine.findByPk(wineId, {
				include: 'culture',
			});

			res.status(200).json(wine);

		} catch (error) {
			console.error(error);
			res.status(500).json({ message: error.message });
		}
	}, 

	/** @function 
   	* remove or add dish to wine
   	* @param {Array} id- dish's id in array
   	*/
	async removeDishToWine(req, res){
		try {
			

			const wineId = Number(req.params.id); 

			const { dishIdList } = req.body;

			let wine = await Wine.findByPk(wineId, {
				include : 'dishes'
			});

	
			let initialDishIdList = wine.dishes.map(item => item.id);
			let commonDishIdList = dishIdList.filter(item => initialDishIdList.includes(item));

			let dishToAdd = []; 
			for(let item of dishIdList){
				if(!commonDishIdList.includes(item)){
					const dish = await Dish.findByPk(item);
					if(!dish){
						const error = new Error(`Dish with id ${item} does not exist.`); 
						return res.status(404).json({message : error.message}); 
					}
					dishToAdd.push(dish); 
				}
			}

			let dishToRemove = []; 
			for(let item of initialDishIdList){
				if(!commonDishIdList.includes(item)){
					const dish = await Dish.findByPk(item);
					if(!dish){
						const error = new Error(`Dish with id ${item} does not exist.`); 
						return res.status(404).json({message : error.message}); 
					}
					dishToRemove.push(dish); 
				}
			}

			await wine.addDish(dishToAdd); 
			await wine.removeDish(dishToRemove);

			wine = await Wine.findByPk(wineId, {
				include: 'dishes',
			});

			res.status(200).json(wine);

		} catch (error) {
			console.error(error);
			res.status(500).json({ message: error.message });
		}
	}, 

};

module.exports = adminController;