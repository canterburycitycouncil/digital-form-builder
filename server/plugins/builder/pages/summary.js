const joi = require('joi')
const Page = require('.')
const shortid = require('shortid')
const { payRequest } = require('../../pay')

class SummaryViewModel {
  constructor (model, state) {
    const details = []

      ;[undefined].concat(model.sections).forEach((section, index) => {
      const items = []
      const sectionState = section
        ? (state[section.name] || {})
        : state

      model.pages.forEach(page => {
        if (page.section === section) {
          page.components.formItems.forEach(component => {
            items.push({
              name: component.name,
              path: component.path,
              label: component.localisedString(component.title),
              value: component.getDisplayStringFromState(sectionState),
              url: `/${model.basePath}${page.path}?returnUrl=/${model.basePath}/summary`
            })
          })
        }
      })

      details.push({
        name: section && section.name,
        title: section && section.title,
        items
      })
    })
    let applicableFees = []

    if (model.def.fee) {
      applicableFees = model.def.fee.filter(fee => {
        return model.conditions[fee.condition].fn(state)
      })
    }

    const schema = model.makeSchema(state)
    const result = joi.validate(state, schema, { abortEarly: false })

    if (result.error) {
      this.errors = result.error.details.map(err => {
        const name = err.path[err.path.length - 1]

        return {
          path: err.path.join('.'),
          name: name,
          message: err.message
        }
      })
      this.hasErrors = true

      details.forEach(detail => {
        const sectionErr = this.errors.find(err => err.path === detail.name)

        detail.items.forEach(item => {
          if (sectionErr) {
            item.inError = true
            return
          }

          const err = this.errors.find(err => err.path === (detail.name ? (detail.name + '.' + item.name) : item.name))
          if (err) {
            item.inError = true
          }
        })
      })
    }
    if (applicableFees.length) {
      this.applicableFees = { fees: applicableFees, total: Object.values(applicableFees).map(fee => fee.amount).reduce((a, b) => a + b) }
    }
    this.result = result
    this.details = details
    this.state = state
    this.value = result.value
  }
}

class SummaryPage extends Page {
  makeGetRouteHandler (getState) {
    return async (request, h) => {
      const model = this.model
      model.basePath = h.realm.pluginOptions.basePath || ''
      const state = await model.getState(request)
      const viewModel = new SummaryViewModel(model, state)
      return h.view('summary', viewModel)
    }
  }
  makePostRouteHandler (getState) {
    return async (request, h) => {
      const model = this.model
      model.basePath = h.realm.pluginOptions.basePath || ''
      const state = await model.getState(request)
      const { applicableFees } = new SummaryViewModel(model, state)
      const reference = `FCO-${shortid.generate()}`
      try {
        let res = await payRequest(applicableFees.total, reference, 'pay for your form')
        // res.payment_id + internal ref
        request.yar.set('pay', { payId: res.payment_id, reference })
        h.redirect(res._links.next_url)
      } catch (ex) {
        // error with payRequest
        console.log(ex)
      }
    }
  }
}

module.exports = SummaryPage