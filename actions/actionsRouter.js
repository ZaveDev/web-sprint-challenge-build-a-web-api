const express = require('express');

const actionDb = require('../data/helpers/actionModel')

const router = express.Router();

router.get('/', (req, res) => {
  actionDb.get()
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

router.post('/:id', (req, res) => {
  req.body.project_id = req.params.id
  if ( req.body.description && req.body.notes){
    actionDb.insert(req.body)
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
    res.status(400).json({message: "project_id, description, or notes was missing from your request"})
  }

});

router.get('/:id', validateActionId, (req, res) => {
  res.status(200).json({ data: req.action  })
});

router.put('/:id', validateActionId, (req, res) => {
  if (req.body.notes !== "" && req.body.description !== ""){
  actionDb.update(req.action.id, req.body)
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
    res.status(400).json({message: "notes or description was empty from your request"})
  }
});

router.delete('/:id', validateActionId, (req, res) => {
  actionDb.remove(req.action.id)
    .then(rez => {
      console.log(rez);
      res.status(200).json({ DeleteMessage: `action ${req.action.id} was deleted`}) 
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "something went wrong",
        err: err
      })
    })
});

function validateActionId(req, res, next) {
  const id = req.params.id
  actionDb.get(id)
    .then(rez => {
      if (rez) {
        req.action = rez
        next(); 
      } else {
        res.status(400).json({ message: "action with that id was not not found" })
      }
    })
    .catch(err => {
      res.status(500).json({err: err})
    })
}

module.exports = router;