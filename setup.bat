@echo off
echo �h���[���ǐՃi�r�A�v���̃Z�b�g�A�b�v���J�n���܂�...
echo.

echo �o�b�N�G���h�̈ˑ��֌W���C���X�g�[����...
call npm install
if %errorlevel% neq 0 (
    echo �G���[: �o�b�N�G���h�̈ˑ��֌W�̃C���X�g�[���Ɏ��s���܂���
    pause
    exit /b 1
)

echo.
echo �t�����g�G���h�̈ˑ��֌W���C���X�g�[����...
cd client
call npm install
if %errorlevel% neq 0 (
    echo �G���[: �t�����g�G���h�̈ˑ��֌W�̃C���X�g�[���Ɏ��s���܂���
    pause
    exit /b 1
)
cd ..

echo.
echo �Z�b�g�A�b�v���������܂����I
echo.
echo �A�v���P�[�V�������N������ɂ͈ȉ��̃R�}���h�����s���Ă�������:
echo   npm start
echo.
echo �J�����[�h�ŋN������ɂ�:
echo   npm run dev
echo.
echo �u���E�U�� http://localhost:3000 �ɃA�N�Z�X���Ă�������
echo.
pause
