/// <reference path="utils.ts" />
/// <reference path="models.ts" />

import Models = require("./models");
import Utils = require("./utils");

export class NullOrderGateway implements Models.IOrderEntryGateway {
    OrderUpdate = new Utils.Evt<Models.OrderStatusReport>();
    ConnectChanged = new Utils.Evt<Models.ConnectivityStatus>();

    sendOrder(order : Models.BrokeredOrder) : Models.OrderGatewayActionReport {
        setTimeout(() => this.trigger(order.orderId, Models.OrderStatus.Working), 10);
        return new Models.OrderGatewayActionReport(Utils.date());
    }

    cancelOrder(cancel : Models.BrokeredCancel) : Models.OrderGatewayActionReport {
        setTimeout(() => this.trigger(cancel.clientOrderId, Models.OrderStatus.Complete), 10);
        return new Models.OrderGatewayActionReport(Utils.date());
    }

    replaceOrder(replace : Models.BrokeredReplace) : Models.OrderGatewayActionReport {
        this.cancelOrder(new Models.BrokeredCancel(replace.origOrderId, replace.orderId, replace.side, replace.exchangeId));
        return this.sendOrder(replace);
    }

    private trigger(orderId : string, status : Models.OrderStatus) {
        var rpt : Models.OrderStatusReport = {
            orderId: orderId,
            orderStatus: status,
            time: Utils.date()
        };
        this.OrderUpdate.trigger(rpt);
    }

    constructor() {
        setTimeout(() => this.ConnectChanged.trigger(Models.ConnectivityStatus.Connected), 500);
    }
}

export class NullPositionGateway implements Models.IPositionGateway {
    PositionUpdate = new Utils.Evt<Models.CurrencyPosition>();

    constructor() {
        setInterval(() => this.PositionUpdate.trigger(new Models.CurrencyPosition(500, Models.Currency.USD)), 2500);
        setInterval(() => this.PositionUpdate.trigger(new Models.CurrencyPosition(2, Models.Currency.BTC)), 5000);
    }
}