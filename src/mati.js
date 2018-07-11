import {MatiBase} from './matiBase'
import FormData from 'form-data'

/**
 * @class Mati
 * @extends MatiBase
 * @public
 * @classdesc The Mati SDK class that provides methods to verify your customers.
 * @example
 * var matiClient = require('mati-sdk').Mati;
 * var mati = new matiClient({
 *    'clientId': '{your_client_Id}',
 *    'secretId': '{your_secret_Id}',
 * });
 */

export class Mati extends MatiBase {
  /**
   * @description Create a webhook subscription on your mati account.
   * @function Mati#subscribeWebhook
   * @memberof Mati
   * @arg {object} data - Your webhook data
   * @arg {string} data.url - Your webhook url
   * @arg {string} data.secret - Your webhook secret
   * @returns {Promise} Resolves to webhook subscription created response
   * @example
   * mati.subscribeWebhook({
   *    'url': '{your_webhook_url}',
   *    'secret': '{your_secret}',
   * }).then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  subscribeWebhook (data) {
    return this.request('POST', '/v1/webhooks', data)
  };

  /**
   * @description Get a single webhook subscription by id.
   * @function Mati#getSubscription
   * @memberof Mati
   * @arg {object} data - Your webhook data
   * @arg {string} data.webhook - Your webhook id
   * @returns {Promise} Resolves to webhook single subscription
   * @example
   * mati.getSubscription({
   *    'webhookId': 'your_webhookId'
   * }).then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  getSubscription (data) {
    return this.request('GET', `/v1/webhooks/${data.webhookId}`)
  };

  /**
   * @description List all your webhook subscriptions on your mati account.
   * @function Mati#listSubscriptions
   * @memberof Mati
   * @returns {Promise} Resolves to webhook subscriptions list response
   * @example
   * mati.listSubscriptions()
   * .then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  listSubscriptions () {
    return this.request('GET', '/v1/webhooks')
  };

  /**
   * @description Delete webhook subscription by id.
   * @function Mati#deleteSubscription
   * @memberof Mati
   * @arg {object} data - Your webhook data
   * @arg {string} data.webhook - Your webhook id
   * @returns {Promise} Resolves to webhook delete subscription response
   * @example
   * mati.deleteSubscription({
   *    'webhookId': 'your_webhookId'
   * })
   * .then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  deleteSubscription (data) {
    return this.request('DELETE', `/v1/webhooks/${data.webhookId}`)
  };

  /**
   * @description Create new Identity on your mati account.
   * @function Mati#createIdentity
   * @memberof Mati
   * @arg {object} data - Your client identity metadata and selfie
   * @arg {object} [data.metadata] - Your metadata information
   * @arg {object} [data.file] - Media object
   * @returns {Promise} Resolves to identity created response
   * @example
   * mati.createIdentity({
   *    'metadata': {'your_custo_data': 'your_custom_data_value'},
   *    'file': fs.createReadStream('selfie.png'),
   * })
   * .then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  createIdentity (data) {
    let form = new FormData()

    if (data !== undefined) {
      if (data.metadata) {
        for (var key in data.metadata) {
          if (data.metadata.hasOwnProperty(key)) {
            form.append('metadata[' + key + ']', data.metadata[key])
          }
        }
      }
      if (data.file) {
        form.append('photo', data.file, 'identity.jpeg')
      }
    }

    return this.uploadRequest('POST', `/v1/identities`, form)
  };

  /**
   * @description List all identities on your Mati account.
   * @function Mati#listIdentities
   * @memberof Mati
   * @returns {Promise} Resolves to your Mati account identity list
   * @example
   * mati.listIdentities()
   * .then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  listIdentities () {
    return this.request('GET', `/v1/identities`)
  };

  /**
   * @description Get single identity by id.
   * @function Mati#getIdentity
   * @memberof Mati
   * @arg {object} data - Your client identity data
   * @arg {string} data.identityId - Your webhook id
   * @returns {Promise} Resolves to identity response
   * @example
   * mati.getIdentity({
   *    'identityId':'your_client's_mati_identity_id'
   * })
   * .then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  getIdentity (data) {
    return this.request('GET', `/v1/identities/${data.identityId}`)
  };

  /**
   * @description Upload document front image.
   * @function Mati#uploadIdFront
   * @memberof Mati
   * @arg {object} data - Your client id front side document
   * @arg {string} data.identityId - IdentityId
   * @arg {object} data.file - Media object
   * @arg {string} [data.type] - Document type (default = 'national-id')
   * @returns {Promise} Resolves to document front upload response
   * @example
   * mati.uploadIdFront({
   *    'identityId':'your_client's_mati_identity_id',
   *    'file': fs.createReadStream('selfie.png'),
   * })
   * .then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  uploadIdFront (data) {
    if (!data.file || !data.identityId) throw Error
    let form = new FormData()
    form.append('type', data.type || 'national-id')
    form.append('side', 'front')
    form.append('picture', data.file, 'front.jpeg')
    return this.uploadRequest('POST', `/v1/identities/${data.identityId}/documents`, form)
  };

  /**
   * @description Upload document back image.
   * @function Mati#uploadIdBack
   * @memberof Mati
   * @arg {object} data - Your client id back side document
   * @arg {string} data.documentId - DocumentId
   * @arg {object} data.file - Media object
   * @returns {Promise} Resolves to document back upload response
   * @example
   * mati.uploadIdBack({
   *    'documentId':'your_client's_mati_document_id',
   *    'file': fs.createReadStream('selfie.png'),
   * })
   * .then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  uploadIdBack (data) {
    if (!data.file || !data.documentId) throw Error
    let form = new FormData()
    data.append('side', 'back')
    data.append('picture', data.file, 'front.jpeg')
    return this.uploadRequest('PUT', `/v1/documents/${data.documentId}`, form)
  };

  /**
   * @description Update document fields.
   * @function Mati#updateFields
   * @memberof Mati
   * @arg {object} data - Update client document fields
   * @arg {string} data.documentId - DocumentId
   * @arg {object} data.fields - Fields to modify
   * @returns {Promise} Resolves to update fields response
   * @example
   * mati.updateFields({
   *  'fields': [{
   *    'id': 'curp',
   *    'value': 'HEEN860807MDFRSY08'
   *  }, {
   *    'id': 'ne',
   *    'value': '03'
   *  }, {
   *    'id': 'cde',
   *    'value': 'HRESNY86080709M100'
   *  }]
   *})
   * .then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  updateFields (data) {
    return this.request('PATCH', `/v1/documents/${data.documentId}`, data.fields)
  };

  /**
   * @description Get all documents by identity id.
   * @function Mati#listDocuments
   * @memberof Mati
   * @arg {object} data - Your client identity documents uploaded
   * @arg {string} data.identityId - IdentityId
   * @returns {Promise} Resolves to identity document list
   * @example
   * mati.listDocuments({
   *  'identityId': 'your_client_mati_identityId'
   *  }]
   *})
   * .then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  listDocuments (data) {
    return this.request('GET', `/v1/identities/${data.identityId}/documents`)
  };

  /**
   * @description Get single document by document id.
   * @function Mati#getDocument
   * @memberof Mati
   * @arg {object} data - Your client's document
   * @arg {string} data.documentId - DocumentId
   * @returns {Promise} Resolves to document details response
   * @example
   * mati.getDocument({
   *  'documentId': 'your_client_mati_documentId'
   *  }]
   *})
   * .then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  getDocument (data) {
    return this.request('GET', `/v1/documents/${data.documentId}`)
  };

  /**
   * @description Get document verified data by document id.
   * @function Mati#getVerifiedData
   * @memberof Mati
   * @arg {object} data - Your client's document verified data
   * @arg {string} data.documentId - DocumentId
   * @returns {Promise} Resolves to document verified data response
   * @example
   * mati.getVerifiedData({
   *  'documentId': 'your_client_mati_documentId'
   *  }]
   *})
   * .then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  getVerifiedData (data) {
    return this.request('GET', `/v1/documents/${data.documentId}/verified-data`)
  };

  /**
   * @description Get list of pictures of the document by document id.
   * @function Mati#listDocumentPictures
   * @memberof Mati
   * @arg {object} - Your client's documents picture list
   * @arg {string} data.documentId - DocumentId
   * @returns {Promise} Resolves to pictures list response
   * @example
   * mati.listPictures({
   *  'documentId': 'your_client_mati_documentId'
   *  }]
   *})
   * .then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  listPictures (data) {
    return this.request('GET', `/v1/documents/${data.documentId}/pictures`)
  };

  /**
   * @description Get single picture by pictureId id.
   * @function Mati#getPicture
   * @memberof Mati
   * @arg {object} - Your client's document picture
   * @arg {string} - data.pictureId
   * @returns {Promise} Resolves to picture details response
   * @example
   * mati.getPicture({
   *  'pictureId': 'your_document_pictureId'
   *  }]
   *})
   * .then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  getPicture (data) {
    return this.request('GET', `/v1/pictures/${data.pictureId}`)
  };

  /**
   * @description Download single picture by id.
   * @function Mati#downloadPicture
   * @memberof Mati
   * @arg {object} data - Your client's document picture to download
   * @arg {string} data.pictureId - pictureId
   * @returns {Promise} Resolves to pictures download response
   * @example
   * mati.downloadPicture({
   *  'pictureId': 'your_document_pictureId'
   *  }]
   *})
   * .then(res => {
   *    // -> handle response
   * }).catch(err => {
   *    // -> handle error
   * })
   */
  downloadPicture (data) {
    return this.request('GET', `/v1/pictures/${data.pictureId}.jpg`)
  };
}
