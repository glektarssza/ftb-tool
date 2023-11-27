import chai, {expect} from 'chai';
import {SinonStub, SinonStubbedInstance, createStubInstance, stub} from 'sinon';
import sinonChai from 'sinon-chai';
import {en, en_US, base, Faker} from '@faker-js/faker';
import {ReadStream, Stats} from 'node:fs';
import fs, {CreateReadStreamOptions, FileHandle} from 'node:fs/promises';
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
        it('should return `false` if the path exists but is not a directory', async () => {
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
        it('should return `true` if the path is a block device', async () => {
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
        it('should return `false` if the path exists but is not a block device', async () => {
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
        it('should return `true` if the path is a character device', async () => {
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
        it('should return `false` if the path exists but is not a character device', async () => {
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
        it('should return `true` if the path is a socket', async () => {
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
        it('should return `false` if the path exists but is not a socket', async () => {
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
        it('should return `true` if the path is a symbolic link', async () => {
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
        it('should return `false` if the path exists but is not a symbolic link', async () => {
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
    describe('.isReadable', () => {
        let isBlockDeviceStub: SinonStub<
            Parameters<typeof fsHelper.isBlockDevice>,
            ReturnType<typeof fsHelper.isBlockDevice>
        >;
        let isCharacterDeviceStub: SinonStub<
            Parameters<typeof fsHelper.isCharacterDevice>,
            ReturnType<typeof fsHelper.isCharacterDevice>
        >;
        let isFileStub: SinonStub<
            Parameters<typeof fsHelper.isFile>,
            ReturnType<typeof fsHelper.isFile>
        >;
        let isSocketStub: SinonStub<
            Parameters<typeof fsHelper.isSocket>,
            ReturnType<typeof fsHelper.isSocket>
        >;
        before(() => {
            isBlockDeviceStub = stub(fsHelper, 'isBlockDevice');
            isCharacterDeviceStub = stub(fsHelper, 'isCharacterDevice');
            isFileStub = stub(fsHelper, 'isFile');
            isSocketStub = stub(fsHelper, 'isSocket');
        });
        beforeEach(() => {
            isBlockDeviceStub.reset();
            isCharacterDeviceStub.reset();
            isFileStub.reset();
            isSocketStub.reset();

            isBlockDeviceStub.callThrough();
            isCharacterDeviceStub.callThrough();
            isFileStub.callThrough();
            isSocketStub.callThrough();
        });
        after(() => {
            isBlockDeviceStub.restore();
            isCharacterDeviceStub.restore();
            isFileStub.restore();
            isSocketStub.restore();
        });
        it('should return `true` if the path is a block device', async () => {
            //-- Given
            const path = fake.system.filePath();
            isBlockDeviceStub.withArgs(path).resolves(true);
            isCharacterDeviceStub.withArgs(path).resolves(false);
            isFileStub.withArgs(path).resolves(false);
            isSocketStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isReadable(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `true` if the path is a character device', async () => {
            //-- Given
            const path = fake.system.filePath();
            isBlockDeviceStub.withArgs(path).resolves(false);
            isCharacterDeviceStub.withArgs(path).resolves(true);
            isFileStub.withArgs(path).resolves(false);
            isSocketStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isReadable(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `true` if the path is a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            isBlockDeviceStub.withArgs(path).resolves(false);
            isCharacterDeviceStub.withArgs(path).resolves(false);
            isFileStub.withArgs(path).resolves(true);
            isSocketStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isReadable(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `true` if the path is a socket', async () => {
            //-- Given
            const path = fake.system.filePath();
            isBlockDeviceStub.withArgs(path).resolves(false);
            isCharacterDeviceStub.withArgs(path).resolves(false);
            isFileStub.withArgs(path).resolves(false);
            isSocketStub.withArgs(path).resolves(true);

            //-- When
            const r = await fsHelper.isReadable(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path is not a character/block device, a file, or a socket', async () => {
            //-- Given
            const path = fake.system.filePath();
            isBlockDeviceStub.withArgs(path).resolves(false);
            isCharacterDeviceStub.withArgs(path).resolves(false);
            isFileStub.withArgs(path).resolves(false);
            isSocketStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isReadable(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.createReadableStream', () => {
        let isReadableStub: SinonStub<
            Parameters<typeof fsHelper.isReadable>,
            ReturnType<typeof fsHelper.isReadable>
        >;
        let openStub: SinonStub<
            Parameters<typeof fs.open>,
            ReturnType<typeof fs.open>
        >;
        let createReadStreamStub: SinonStub<
            Parameters<FileHandle['createReadStream']>,
            ReturnType<FileHandle['createReadStream']>
        >;
        let fdStub: SinonStubbedInstance<FileHandle>;
        const readStreamStub = createStubInstance(ReadStream);
        before(() => {
            isReadableStub = stub(fsHelper, 'isReadable');
            openStub = stub(fs, 'open');
            createReadStreamStub = stub();
            fdStub = {
                createReadStream: createReadStreamStub
            } as SinonStubbedInstance<FileHandle>;
        });
        beforeEach(() => {
            isReadableStub.reset();
            openStub.reset();
            createReadStreamStub.reset();

            isReadableStub.callThrough();
            openStub.callThrough();
            createReadStreamStub.resolves(readStreamStub);
        });
        after(() => {
            isReadableStub.restore();
            openStub.restore();
        });
        it('should call `fs.open` with the given path and the `r` option', async () => {
            //-- Given
            const path = fake.system.filePath();
            isReadableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'r').resolves(fdStub);

            //-- When
            await fsHelper.createReadableStream(path);

            expect(openStub).to.have.been.calledOnceWith(path, 'r');
        });
        it('should call `createReadStream` on the resulting file descriptor', async () => {
            //-- Given
            const path = fake.system.filePath();
            isReadableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'r').resolves(fdStub);

            //-- When
            await fsHelper.createReadableStream(path);

            expect(createReadStreamStub).to.have.been.calledOnce;
        });
        it('should pass any options provided to `createReadStream`', async () => {
            //-- Given
            const path = fake.system.filePath();
            const opts: CreateReadStreamOptions = {};
            isReadableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'r').resolves(fdStub);

            //-- When
            await fsHelper.createReadableStream(path, opts);

            expect(createReadStreamStub).to.have.been.calledOnceWith(opts);
        });
        it('should return a `ReadStream` on success', async () => {
            //-- Given
            const path = fake.system.filePath();
            const readStream = {} as ReadStream;
            isReadableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'r').resolves(fdStub);
            createReadStreamStub.resolves(readStream);

            //-- When
            const r = await fsHelper.createReadableStream(path);

            //-- Then
            expect(r).to.equal(readStream);
        });
        it('should throw an `Error` if the path is not readable', async () => {
            //-- Given
            const path = fake.system.filePath();
            const readStream = {} as ReadStream;
            isReadableStub.withArgs(path).resolves(false);
            openStub.withArgs(path, 'r').resolves(fdStub);
            createReadStreamStub.resolves(readStream);

            //-- When
            try {
                await fsHelper.createReadableStream(path);
            } catch (ex) {
                //-- Then
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(`"${path}" is not readable`);
                return;
            }
            //-- Then
            expect.fail('Function did not throw when it should have');
        });
        it('should throw an `Error` if the path cannot be opened', async () => {
            //-- Given
            const path = fake.system.filePath();
            const readStream = {} as ReadStream;
            isReadableStub.withArgs(path).resolves(true);
            openStub
                .withArgs(path, 'r')
                .rejects(
                    new Error(`Failed to open "${path}", permission denied`)
                );
            createReadStreamStub.resolves(readStream);

            //-- When
            try {
                await fsHelper.createReadableStream(path);
            } catch (ex) {
                //-- Then
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(`Failed to open "${path}", permission denied`);
                return;
            }
            //-- Then
            expect.fail('Function did not throw when it should have');
        });
        it('should throw an `Error` if the creation of the `ReadStream` fails', async () => {
            //-- Given
            const path = fake.system.filePath();
            isReadableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'r').resolves(fdStub);
            createReadStreamStub.rejects(
                new Error('Failed to create ReadStream, malloc failed')
            );

            //-- When
            try {
                await fsHelper.createReadableStream(path);
            } catch (ex) {
                //-- Then
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals('Failed to create ReadStream, malloc failed');
                return;
            }
            //-- Then
            expect.fail('Function did not throw when it should have');
        });
    });
    describe('.createWriteableStream', () => {});
    describe('.checkFileIntegrity', () => {});
    describe('.createTempDirectory', () => {});
    describe('.createOSTempDirectory', () => {});
    describe('.removeFile', () => {});
    describe('.removeDirectory', () => {});
    describe('.copyFile', () => {});
    describe('.copyDirectory', () => {});
});
