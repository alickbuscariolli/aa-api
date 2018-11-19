const express = require('express');
const router = express.Router();
const app = express();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://alick:0A0D000B00@localhost:5432/digital_proj';
const cors = require('cors');
const querystring = require('querystring');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//CORS to avoid ports conflict
router.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

//**** RECIPES ****

//Post Recipe
router.post('/recipes', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {title: req.body.title, 
                directions: req.body.directions, 
                time: req.body.time,
                ethnicity: req.body.ethnicity,
                difficulty: req.body.difficulty,
                ingredients: req.body.ingredients,
                imgpath: req.body.imgpath,
                reference: req.body.reference};

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('INSERT INTO recipes(title, directions, time, ethnicity, difficulty, ingredients, imgpath, reference) values($1, $2, $3, $4, $5, $6, $7, $8)',
    [data.title, data.directions, data.time, data.ethnicity, data.difficulty, data.ingredients, data.imgpath, data.reference]);

    const query = client.query('SELECT * FROM recipes ORDER BY id ASC');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Get Recipes
router.get('/recipes', (req, res, next) => {
  const results = [];

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    const query = client.query('SELECT * FROM recipes ORDER BY id ASC;');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Get Recipe
router.get('/recipe/:id', (req, res, next) => {
  const results = [];
  const id = req.params.id;

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    const query = client.query('SELECT * FROM recipes WHERE id=($1)', [id]);

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Update Recipe
router.put('/recipes/:recipe_id', (req, res, next) => {
  const results = [];

  const id = req.params.recipe_id;

  const data = {title: req.body.title, 
                directions: req.body.directions,
                time: req.body.time,
                ethnicity: req.body.ethnicity,
                difficulty: req.body.difficulty,
                ingredients: req.body.ingredients,
                imgpath: req.body.imgpath,
                reference: req.body.reference};

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('UPDATE recipes SET title=($1), directions=($2), time=($3), ethnicity=($4), difficulty=($5), ingredients=($6), imgpath=($7), reference=($8) WHERE id=($9)',
    [data.title, data.directions, data.time, data.ethnicity, data.difficulty, data.ingredients, data.imgpath, data.reference, id]);

    const query = client.query("SELECT * FROM recipes ORDER BY id ASC");

    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

//Delete Recipe
router.delete('/recipes/:recipe_id', (req, res, next) => {
  const results = [];

  const id = req.params.recipe_id;

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('DELETE FROM recipes WHERE id=($1)', [id]);

    var query = client.query('SELECT * FROM recipes ORDER BY id ASC');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//**** INGREDIENTS ****

//Post Ingredient
router.post('/ingredients', (req, res, next) => {
  const results = [];
  // Grab data from http request
  console.log(req.body.name);
  const data = {name: req.body.name,
                category: req.body.category,
                toggle: req.body.toggle};

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('INSERT INTO ingredients(name, category, toggle) values($1, $2, $3)',
    [data.name, data.category, data.toggle]);

    const query = client.query('SELECT * FROM ingredients ORDER BY id ASC');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Get Ingredients
router.get('/ingredients', (req, res, next) => {
  const results = [];

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    const query = client.query('SELECT * FROM ingredients ORDER BY name ASC;');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Update Ingredient
router.put('/ingredients/:ingredient_id', (req, res, next) => {
  const results = [];

  const id = req.params.ingredient_id;

  const data = {name: req.body.name,
                category: req.body.category};

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('UPDATE ingredients SET name=($1), category=($2) WHERE id=($3)',
    [data.name, data.category, id]);

    const query = client.query("SELECT * FROM ingredients ORDER BY id ASC");

    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

//Delete Recipe
router.delete('/ingredients/:ingredient_id', (req, res, next) => {
  const results = [];

  const id = req.params.ingredient_id;

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('DELETE FROM ingredients WHERE id=($1)', [id]);

    var query = client.query('SELECT * FROM ingredients ORDER BY id ASC');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Get ingtredients from a recipe
router.get('/ingredients/:recipe_id', (req, res, next) => {
  const results = [];
  const id = req.params.recipe_id;

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    const query = client.query('SELECT * FROM ingredients as i INNER JOIN recipe_ing_fk as rifk ON rifk.ingredient_fk = i.id INNER JOIN recipes as r ON rifk.recipe_fk = r.id WHERE r.id=($1)', [id]);

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Filter recipe by ingredient
router.get('/recipes/:ingredient_id', (req, res, next) => {
  const results = [];
  const id = req.params.ingredient_id;

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    const query = client.query('SELECT recipe_fk FROM ingredients WHERE id=($1)', [id]);

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Get all recipes by ingredient
router.get('/recipes/ingredients/:ingredient_id', (req, res, next) => {
  const results = [];
  const id = req.params.ingredient_id;

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    const query = client.query('SELECT * FROM recipes as r INNER JOIN recipe_ing_fk as rifk ON rifk.recipe_fk = r.id INNER JOIN ingredients as i ON rifk.ingredient_fk = i.id WHERE i.id=($1)', [id]);

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Update recipe_ing_fk
router.put('/recipes/ingredients/update/:ingredient_id', (req, res, next) => {
  const results = [];

  const id = req.params.ingredient_id;

  const data = {ingredient_fk: req.body.ingredient_fk};

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('UPDATE recipe_ing_fk SET ingredient_fk=($1) WHERE id=($2)',
    [data.ingredient_fk, id]);

    const query = client.query("SELECT * FROM recipe_ing_fk ORDER BY id ASC");

    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

//Get all recipes by ingredient
router.get('/recipes/ing/ing', (req, res, next) => {
  const results = [];
  res.render('ing', {qs: req.query});
  //const id = req.params.ingredient_id;
  console.log(req.query);
  const ingObj = querystring.parse(req.params.ingredients_id);
  console.log(ingObj + "ae");

  // pg.connect(connectionString, (err, client, done) => {
  //   // Handle connection errors
  //   if(err) {
  //     done();
  //     console.log(err);
  //     return res.status(500).json({success: false, data: err});
  //   }

  //   const query = client.query('SELECT * FROM recipes as r INNER JOIN recipe_ing_fk as rifk ON rifk.recipe_fk = r.id INNER JOIN ingredients as i ON rifk.ingredient_fk = i.id WHERE i.id=($1) AND i.id=($2)', [ingObj.ingredients, ingObj.ingredientss]);

  //   query.on('row', (row) => {
  //     results.push(row);
  //   });

  //   query.on('end', () => {
  //     done();
  //     return res.json(results);
  //   });
  // });
});

//Post Recipe Ingredient FK
router.post('/recipes/ingredients', (req, res, next) => {
  const results = [];
  const data = {recipe_fk: req.body.recipe_fk, 
                ingredient_fk: req.body.ingredient_fk};

  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('INSERT INTO recipe_ing_fk(recipe_fk, ingredient_fk) values($1, $2)',
    [data.recipe_fk, data.ingredient_fk]);

    const query = client.query('SELECT * FROM recipe_ing_fk ORDER BY id ASC');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Delete Recipe Ingredient FK
router.delete('/recipes/ingredients/:reci_ing_id', (req, res, next) => {
  const results = [];

  const reci_ing_id = req.params.reci_ing_id;

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('DELETE FROM recipe_ing_fk WHERE id=($1)', [reci_ing_id]);

    var query = client.query('SELECT * FROM recipe_ing_fk ORDER BY id ASC');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

module.exports = router;
