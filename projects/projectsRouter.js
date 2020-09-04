const express = require('express');

const projectDb = require('../data/helpers/projectModel')

const router = express.Router();

router.get('/', (req, res) => {
  projectDb.get()
    .then(rez => {
      res.status(200).json({ data: rez })
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "something went wrong",
        err: err
      })
    })
});

router.post('/', (req, res) => {
  if (req.body.name && req.body.description){
    projectDb.insert(req.body)
    .then(rez => {
      res.status(200).json({ data: rez }) 
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "something went wrong",
        err: err
      })
    })
  } else {
    res.status(400).json({message: "name or description was missing from your request"})
  }
  
});

router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json({ data: req.project })
});

router.put('/:id', validateProjectId, (req, res) => {
  if (req.body.name !== "" && req.body.description !== ""){
  projectDb.update(req.project.id, req.body)
    .then(rez => {
      res.status(200).json({ data: rez }) 
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "something went wrong",
        err: err
      })
    })
  } else {
    res.status(400).json({message: "name or description was empty from your request"})
  }
});

router.delete('/:id', validateProjectId, (req, res) => {
  projectDb.remove(req.project.id)
    .then(rez => {
      console.log(rez);
      res.status(200).json({ DeleteMessage: `project ${req.project.id} was deleted`})  
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "something went wrong",
        err: err
      })
    })
});

function validateProjectId(req, res, next) {
  const id = req.params.id
  projectDb.get(id)
    .then(rez => {
      if (rez) {
        req.project = rez
        next(); 
      } else {
        res.status(400).json({ message: "project with that id was not not found" })
      }
    })
    .catch(err => {
      res.status(500).json({err: err})
    })
}

module.exports = router;