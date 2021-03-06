/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import func from './index'
import { Context } from '@azure/functions'
import * as reward_modules from '../common/reward'
import { generateHttpRequest } from '../common/test-utils'

let getRewardApiResponce: sinon.SinonStub<[githubId: string], Promise<ApiResponce>>
test.before(() => {
	getRewardApiResponce = sinon.stub(reward_modules, 'getRewardApiResponce')
})

test('get reward info ', async (t) => {
	getRewardApiResponce.withArgs('github-id1').resolves({
		status: 200,
		body: {
			dummy_key: 'dummy_value'
		}
	})
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({ github_id: 'github-id1' }, {})
	)
	t.is(res.body.dummy_key, 'dummy_value')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('Incorrect parameters information.', async (t) => {
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, {})
	)
	t.is(res.body.message, 'parameters error')
	t.is(res.status, 400)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test.after(() => {
	getRewardApiResponce.restore()
})
