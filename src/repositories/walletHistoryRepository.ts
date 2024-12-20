import WalletHistory, { IWalletHistory } from "../models/walletHistoryModel";

class WalletHistoryRepository {

    async create(walletHistoryData: Partial<IWalletHistory>): Promise<IWalletHistory> {
        const walletHistory = new WalletHistory(walletHistoryData)
        return await walletHistory.save();
    }

    async findHistories(userId: string): Promise<IWalletHistory[] | []> {
        return await WalletHistory.find({userId})
    }

}

export default new WalletHistoryRepository