
/// <reference path="../express/express.d.ts" />

declare module "connect-timeout" {
    import express = require('express');
    module connectTimeout {
    }
    function connectTimeout(timeout?: string): express.RequestHandler;
    export = connectTimeout;
}