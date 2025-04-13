import router from '@adonisjs/core/services/router'

import { middleware } from './kernel.js'

import UsersController from '#controllers/users_controller'
import SitesController from '#controllers/sites_controller'
import SessionController from '#controllers/session_controller'

router.post('session', [SessionController,'store'])

router.resource('user', UsersController).apiOnly()

router.group(() => {
    router.resource('site', SitesController).apiOnly()
}).use(middleware.auth())