import { authService } from './auth.service.js';
export async function register(req, res) {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
}
export async function login(req, res) {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
}
export async function verifyOTP(req, res) {
    const result = await authService.verifyOTP(req.body);
    return res.status(200).json(result);
}
export async function resendOTP(req, res) {
    const result = await authService.resendOTP(req.body);
    return res.status(200).json(result);
}
export async function logout(_req, res) {
    await authService.logout();
    return res.status(204).send();
}
export async function getSession(_req, res) {
    const session = await authService.getSession();
    return res.status(200).json(session);
}
