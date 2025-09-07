const express = require('express');
const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Base de données simulée en mémoire
let users = [
    { id: 1, nom: 'Alice', email: 'alice@example.com', age: 25 },
    { id: 2, nom: 'Bob', email: 'bob@example.com', age: 30 },
    { id: 3, nom: 'Charlie', email: 'charlie@example.com', age: 35 }
];

let nextId = 4;


// GET - Récupérer tous les utilisateurs
app.get('/users', (req, res) => {
    res.json({
        success: true,
        data: users,
        count: users.length
    });
});

// GET - Récupérer un utilisateur par ID
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Utilisateur non trouvé'
        });
    }
    
    res.json({
        success: true,
        data: user
    });
});

// POST - Créer un nouvel utilisateur
app.post('/users', (req, res) => {
    const { nom, email, age } = req.body;
    
    // Validation simple
    if (!nom || !email || !age) {
        return res.status(400).json({
            success: false,
            message: 'Tous les champs (nom, email, age) sont requis'
        });
    }
    
    // Vérifier si l'email existe déjà
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: 'Un utilisateur avec cet email existe déjà'
        });
    }
    
    const newUser = {
        id: nextId++,
        nom,
        email,
        age: parseInt(age)
    };
    
    users.push(newUser);
    
    res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: newUser
    });
});

// PUT - Modifier un utilisateur
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Utilisateur non trouvé'
        });
    }
    
    const { nom, email, age } = req.body;
    
    // Validation
    if (!nom || !email || !age) {
        return res.status(400).json({
            success: false,
            message: 'Tous les champs (nom, email, age) sont requis'
        });
    }
    
    // Vérifier si l'email existe déjà (sauf pour l'utilisateur actuel)
    const existingUser = users.find(u => u.email === email && u.id !== id);
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: 'Un autre utilisateur avec cet email existe déjà'
        });
    }
    
    // Mettre à jour l'utilisateur
    users[userIndex] = {
        id,
        nom,
        email,
        age: parseInt(age)
    };
    
    res.json({
        success: true,
        message: 'Utilisateur modifié avec succès',
        data: users[userIndex]
    });
});

// DELETE - Supprimer un utilisateur
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Utilisateur non trouvé'
        });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.json({
        success: true,
        message: 'Utilisateur supprimé avec succès',
        data: deletedUser
    });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
    });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
    console.log(`📚 Documentation des endpoints disponible sur http://localhost:${port}`);
});

module.exports = app;