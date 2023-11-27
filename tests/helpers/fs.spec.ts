import chai, {expect} from 'chai';
import {SinonStub, stub} from 'sinon';
import sinonChai from 'sinon-chai';
import {en, en_US, base, Faker} from '@faker-js/faker';
import {Stats} from 'node:fs';
import fs from 'node:fs/promises';
import fsHelper from '@src/helpers/fs';

chai.use(sinonChai);

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('module:helpers.fs', () => {
    describe('.exists', () => {
        let accessStub: SinonStub<
            Parameters<typeof fs.access>,
            ReturnType<typeof fs.access>
        >;
        before(() => {
            accessStub = stub(fs, 'access');
        });
        beforeEach(() => {
            accessStub.reset();
            accessStub.callThrough();
        });
        after(() => {
            accessStub.restore();
        });
        it('should call fs.access with the correct arguments', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.exists(path);

            //-- Then
            expect(accessStub).to.have.been.calledOnceWithExactly(
                path,
                fs.constants.F_OK
            );
        });
        it('should return `true` if the file exists on the disk', async () => {
            //-- Given
            const path = fake.system.filePath();
            accessStub.withArgs(path, fs.constants.F_OK).resolves(undefined);

            //-- When
            const r = await fsHelper.exists(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the file does not exist on the disk', async () => {
            //-- Given
            const path = fake.system.filePath();
            accessStub
                .withArgs(path, fs.constants.F_OK)
                .rejects(new Error('File does not exist'));

            //-- When
            const r = await fsHelper.exists(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isFile', () => {
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let statStub: SinonStub<
            Parameters<typeof fs.stat>,
            ReturnType<typeof fs.stat>
        >;
        before(() => {
            existsStub = stub(fsHelper, 'exists');
            statStub = stub(fs, 'stat');
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            existsStub.callThrough();
            statStub.callThrough();
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should call `exists` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.isFile(path);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(path);
        });
        it('should call `fs.stat` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isFile() {
                    return true;
                }
            } as Stats);

            //-- When
            await fsHelper.isFile(path);

            //-- Then
            expect(statStub).to.have.been.calledOnceWith(path);
        });
        it('should return `true` if the path is a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isFile() {
                    return true;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isFile(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path exists but is not a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isFile() {
                    return false;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isFile(path);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the path does not exist', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isFile(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isDirectory', () => {
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let statStub: SinonStub<
            Parameters<typeof fs.stat>,
            ReturnType<typeof fs.stat>
        >;
        before(() => {
            existsStub = stub(fsHelper, 'exists');
            statStub = stub(fs, 'stat');
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            existsStub.callThrough();
            statStub.callThrough();
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should call `exists` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.isDirectory(path);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(path);
        });
        it('should call `fs.stat` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isDirectory() {
                    return true;
                }
            } as Stats);

            //-- When
            await fsHelper.isDirectory(path);

            //-- Then
            expect(statStub).to.have.been.calledOnceWith(path);
        });
        it('should return `true` if the path is a directory', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isDirectory() {
                    return true;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isDirectory(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path exists but is not a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isDirectory() {
                    return false;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isDirectory(path);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the path does not exist', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isDirectory(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isBlockDevice', () => {
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let statStub: SinonStub<
            Parameters<typeof fs.stat>,
            ReturnType<typeof fs.stat>
        >;
        before(() => {
            existsStub = stub(fsHelper, 'exists');
            statStub = stub(fs, 'stat');
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            existsStub.callThrough();
            statStub.callThrough();
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should call `exists` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.isBlockDevice(path);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(path);
        });
        it('should call `fs.stat` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isBlockDevice() {
                    return true;
                }
            } as Stats);

            //-- When
            await fsHelper.isBlockDevice(path);

            //-- Then
            expect(statStub).to.have.been.calledOnceWith(path);
        });
        it('should return `true` if the path is a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isBlockDevice() {
                    return true;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isBlockDevice(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path exists but is not a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isBlockDevice() {
                    return false;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isBlockDevice(path);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the path does not exist', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isBlockDevice(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isCharacterDevice', () => {
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let statStub: SinonStub<
            Parameters<typeof fs.stat>,
            ReturnType<typeof fs.stat>
        >;
        before(() => {
            existsStub = stub(fsHelper, 'exists');
            statStub = stub(fs, 'stat');
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            existsStub.callThrough();
            statStub.callThrough();
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should call `exists` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.isCharacterDevice(path);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(path);
        });
        it('should call `fs.stat` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isCharacterDevice() {
                    return true;
                }
            } as Stats);

            //-- When
            await fsHelper.isCharacterDevice(path);

            //-- Then
            expect(statStub).to.have.been.calledOnceWith(path);
        });
        it('should return `true` if the path is a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isCharacterDevice() {
                    return true;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isCharacterDevice(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path exists but is not a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isCharacterDevice() {
                    return false;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isCharacterDevice(path);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the path does not exist', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isCharacterDevice(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isSocket', () => {
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let statStub: SinonStub<
            Parameters<typeof fs.stat>,
            ReturnType<typeof fs.stat>
        >;
        before(() => {
            existsStub = stub(fsHelper, 'exists');
            statStub = stub(fs, 'stat');
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            existsStub.callThrough();
            statStub.callThrough();
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should call `exists` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.isSocket(path);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(path);
        });
        it('should call `fs.stat` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isSocket() {
                    return true;
                }
            } as Stats);

            //-- When
            await fsHelper.isSocket(path);

            //-- Then
            expect(statStub).to.have.been.calledOnceWith(path);
        });
        it('should return `true` if the path is a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isSocket() {
                    return true;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isSocket(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path exists but is not a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isSocket() {
                    return false;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isSocket(path);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the path does not exist', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isSocket(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isSymbolicLink', () => {
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let statStub: SinonStub<
            Parameters<typeof fs.stat>,
            ReturnType<typeof fs.stat>
        >;
        before(() => {
            existsStub = stub(fsHelper, 'exists');
            statStub = stub(fs, 'stat');
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            existsStub.callThrough();
            statStub.callThrough();
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should call `exists` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.isSymbolicLink(path);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(path);
        });
        it('should call `fs.stat` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isSymbolicLink() {
                    return true;
                }
            } as Stats);

            //-- When
            await fsHelper.isSymbolicLink(path);

            //-- Then
            expect(statStub).to.have.been.calledOnceWith(path);
        });
        it('should return `true` if the path is a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isSymbolicLink() {
                    return true;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isSymbolicLink(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path exists but is not a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isSymbolicLink() {
                    return false;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isSymbolicLink(path);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the path does not exist', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isSymbolicLink(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isReadable', () => {});
    describe('.createReadableStream', () => {});
    describe('.createWriteableStream', () => {});
    describe('.checkFileIntegrity', () => {});
    describe('.createTempDirectory', () => {});
    describe('.createOSTempDirectory', () => {});
    describe('.removeFile', () => {});
    describe('.removeDirectory', () => {});
    describe('.copyFile', () => {});
    describe('.copyDirectory', () => {});
});
