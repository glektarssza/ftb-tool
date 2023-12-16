//-- NodeJS
import fs from 'node:fs';
import fsp from 'node:fs/promises';

//-- NPM Packages
import chai, {expect} from 'chai';
import {stub} from 'sinon';
import sinonChai from 'sinon-chai';
import {en, en_US, base, Faker} from '@faker-js/faker';

//-- Project Code
import testModule from '@src/lib/fs';

//-- Test Utils
import {StubbedObject, StubbedProperty} from '../types';
import {parseOptionalEnvInteger} from '../utils';

chai.use(sinonChai);

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('module:lib.fs', () => {
    before(() => {
        console.debug(
            `Using "${fake.seed(
                parseOptionalEnvInteger('TESTS_FAKER_SEED') ?? undefined
            )}" as random data seed for "module:helpers.fs" tests...`
        );
    });
    describe('.exists', () => {
        let accessStub: StubbedProperty<typeof fsp, 'access'>;
        before(() => {
            accessStub = stub(fsp, 'access');
        });
        beforeEach(() => {
            accessStub.reset();

            accessStub.rejects(new Error('Stubbed function'));
        });
        after(() => {
            accessStub.restore();
        });
        it('should return `true` if the given path-like exists on the file system', async () => {
            //-- Given
            const p = fake.system.filePath();
            accessStub.withArgs(p).resolves();

            //-- When
            const r = await testModule.exists(p);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the given path-like does not exist on the file system', async () => {
            //-- Given
            const p = fake.system.filePath();
            accessStub.withArgs(p).rejects(new Error('Path does not exist'));

            //-- When
            const r = await testModule.exists(p);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isFile', () => {
        let existsStub: StubbedProperty<typeof testModule, 'exists'>;
        let statStub: StubbedProperty<typeof fsp, 'stat'>;
        let isFileStub: StubbedProperty<fs.Stats, 'isFile'>;
        let statsInstance: Partial<StubbedObject<fs.Stats>>;
        before(() => {
            existsStub = stub(testModule, 'exists');
            statStub = stub(fsp, 'stat');
            isFileStub = stub();
            statsInstance = {
                isFile: isFileStub
            };
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            isFileStub.reset();

            existsStub.rejects(new Error('Stubbed function'));
            statStub.rejects(new Error('Stubbed function'));
            isFileStub.throws(new Error('Stubbed method'));
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should return `true` if the given path-like exists and is a regular file', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(true);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isFileStub.returns(true);

            //-- When
            const r = await testModule.isFile(p);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the given path-like does not exist', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(false);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isFileStub.returns(true);

            //-- When
            const r = await testModule.isFile(p);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the given path-like exists but is not a regular file', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(true);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isFileStub.returns(false);

            //-- When
            const r = await testModule.isFile(p);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isDirectory', () => {
        let existsStub: StubbedProperty<typeof testModule, 'exists'>;
        let statStub: StubbedProperty<typeof fsp, 'stat'>;
        let isDirectoryStub: StubbedProperty<fs.Stats, 'isDirectory'>;
        let statsInstance: Partial<StubbedObject<fs.Stats>>;
        before(() => {
            existsStub = stub(testModule, 'exists');
            statStub = stub(fsp, 'stat');
            isDirectoryStub = stub();
            statsInstance = {
                isDirectory: isDirectoryStub
            };
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            isDirectoryStub.reset();

            existsStub.rejects(new Error('Stubbed function'));
            statStub.rejects(new Error('Stubbed function'));
            isDirectoryStub.throws(new Error('Stubbed method'));
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should return `true` if the given path-like exists and is a directory', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(true);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isDirectoryStub.returns(true);

            //-- When
            const r = await testModule.isDirectory(p);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the given path-like does not exist', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(false);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isDirectoryStub.returns(true);

            //-- When
            const r = await testModule.isDirectory(p);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the given path-like exists but is not a directory', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(true);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isDirectoryStub.returns(false);

            //-- When
            const r = await testModule.isDirectory(p);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isSymbolicLink', () => {
        let existsStub: StubbedProperty<typeof testModule, 'exists'>;
        let statStub: StubbedProperty<typeof fsp, 'stat'>;
        let isSymbolicLinkStub: StubbedProperty<fs.Stats, 'isSymbolicLink'>;
        let statsInstance: Partial<StubbedObject<fs.Stats>>;
        before(() => {
            existsStub = stub(testModule, 'exists');
            statStub = stub(fsp, 'stat');
            isSymbolicLinkStub = stub();
            statsInstance = {
                isSymbolicLink: isSymbolicLinkStub
            };
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            isSymbolicLinkStub.reset();

            existsStub.rejects(new Error('Stubbed function'));
            statStub.rejects(new Error('Stubbed function'));
            isSymbolicLinkStub.throws(new Error('Stubbed method'));
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should return `true` if the given path-like exists and is a symbolic link', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(true);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isSymbolicLinkStub.returns(true);

            //-- When
            const r = await testModule.isSymbolicLink(p);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the given path-like does not exist', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(false);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isSymbolicLinkStub.returns(true);

            //-- When
            const r = await testModule.isSymbolicLink(p);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the given path-like exists but is not a symbolic link', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(true);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isSymbolicLinkStub.returns(false);

            //-- When
            const r = await testModule.isSymbolicLink(p);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isFIFO', () => {
        let existsStub: StubbedProperty<typeof testModule, 'exists'>;
        let statStub: StubbedProperty<typeof fsp, 'stat'>;
        let isFIFOStub: StubbedProperty<fs.Stats, 'isFIFO'>;
        let statsInstance: Partial<StubbedObject<fs.Stats>>;
        before(() => {
            existsStub = stub(testModule, 'exists');
            statStub = stub(fsp, 'stat');
            isFIFOStub = stub();
            statsInstance = {
                isFIFO: isFIFOStub
            };
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            isFIFOStub.reset();

            existsStub.rejects(new Error('Stubbed function'));
            statStub.rejects(new Error('Stubbed function'));
            isFIFOStub.throws(new Error('Stubbed method'));
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should return `true` if the given path-like exists and is a FIFO pipe', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(true);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isFIFOStub.returns(true);

            //-- When
            const r = await testModule.isFIFO(p);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the given path-like does not exist', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(false);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isFIFOStub.returns(true);

            //-- When
            const r = await testModule.isFIFO(p);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the given path-like exists but is not a FIFO pipe', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(true);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isFIFOStub.returns(false);

            //-- When
            const r = await testModule.isFIFO(p);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isBlockDevice', () => {
        let existsStub: StubbedProperty<typeof testModule, 'exists'>;
        let statStub: StubbedProperty<typeof fsp, 'stat'>;
        let isBlockDeviceStub: StubbedProperty<fs.Stats, 'isBlockDevice'>;
        let statsInstance: Partial<StubbedObject<fs.Stats>>;
        before(() => {
            existsStub = stub(testModule, 'exists');
            statStub = stub(fsp, 'stat');
            isBlockDeviceStub = stub();
            statsInstance = {
                isBlockDevice: isBlockDeviceStub
            };
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            isBlockDeviceStub.reset();

            existsStub.rejects(new Error('Stubbed function'));
            statStub.rejects(new Error('Stubbed function'));
            isBlockDeviceStub.throws(new Error('Stubbed method'));
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should return `true` if the given path-like exists and is a block device', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(true);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isBlockDeviceStub.returns(true);

            //-- When
            const r = await testModule.isBlockDevice(p);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the given path-like does not exist', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(false);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isBlockDeviceStub.returns(true);

            //-- When
            const r = await testModule.isBlockDevice(p);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the given path-like exists but is not a block device', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(true);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isBlockDeviceStub.returns(false);

            //-- When
            const r = await testModule.isBlockDevice(p);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isCharacterDevice', () => {
        let existsStub: StubbedProperty<typeof testModule, 'exists'>;
        let statStub: StubbedProperty<typeof fsp, 'stat'>;
        let isCharacterDeviceStub: StubbedProperty<
            fs.Stats,
            'isCharacterDevice'
        >;
        let statsInstance: Partial<StubbedObject<fs.Stats>>;
        before(() => {
            existsStub = stub(testModule, 'exists');
            statStub = stub(fsp, 'stat');
            isCharacterDeviceStub = stub();
            statsInstance = {
                isCharacterDevice: isCharacterDeviceStub
            };
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            isCharacterDeviceStub.reset();

            existsStub.rejects(new Error('Stubbed function'));
            statStub.rejects(new Error('Stubbed function'));
            isCharacterDeviceStub.throws(new Error('Stubbed method'));
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should return `true` if the given path-like exists and is a character device', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(true);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isCharacterDeviceStub.returns(true);

            //-- When
            const r = await testModule.isCharacterDevice(p);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the given path-like does not exist', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(false);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isCharacterDeviceStub.returns(true);

            //-- When
            const r = await testModule.isCharacterDevice(p);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the given path-like exists but is not a character device', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(true);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isCharacterDeviceStub.returns(false);

            //-- When
            const r = await testModule.isCharacterDevice(p);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isSocket', () => {
        let existsStub: StubbedProperty<typeof testModule, 'exists'>;
        let statStub: StubbedProperty<typeof fsp, 'stat'>;
        let isSocketStub: StubbedProperty<fs.Stats, 'isSocket'>;
        let statsInstance: Partial<StubbedObject<fs.Stats>>;
        before(() => {
            existsStub = stub(testModule, 'exists');
            statStub = stub(fsp, 'stat');
            isSocketStub = stub();
            statsInstance = {
                isSocket: isSocketStub
            };
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            isSocketStub.reset();

            existsStub.rejects(new Error('Stubbed function'));
            statStub.rejects(new Error('Stubbed function'));
            isSocketStub.throws(new Error('Stubbed method'));
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should return `true` if the given path-like exists and is a socket', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(true);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isSocketStub.returns(true);

            //-- When
            const r = await testModule.isSocket(p);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the given path-like does not exist', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(false);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isSocketStub.returns(true);

            //-- When
            const r = await testModule.isSocket(p);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the given path-like exists but is not a socket', async () => {
            //-- Given
            const p = fake.system.filePath();
            existsStub.withArgs(p).resolves(true);
            statStub.withArgs(p).resolves(statsInstance as fs.Stats);
            isSocketStub.returns(false);

            //-- When
            const r = await testModule.isSocket(p);

            //-- Then
            expect(r).to.be.false;
        });
    });
});
