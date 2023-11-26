import chai, {expect} from 'chai';
import {spy} from 'sinon';
import sinonChai from 'sinon-chai';
import {en, en_US, base, Faker} from '@faker-js/faker';
import fs from 'node:fs/promises';
import * as fsHelper from '@src/helpers/fs';

chai.use(sinonChai);

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('module:helpers.fs', () => {
    describe('.exists', () => {
        const accessSpy = spy(fs, 'access');
        beforeEach(() => {
            accessSpy.resetHistory();
        });
        after(() => {
            accessSpy.restore();
        });
        it('should call fs.access with the correct arguments', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.exists(path);

            //-- Then
            expect(accessSpy).to.have.been.calledOnceWithExactly(
                path,
                fs.constants.F_OK
            );
        });
    });
});
