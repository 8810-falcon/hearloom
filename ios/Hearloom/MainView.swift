//
//  MainView.swift
//  Hearloom
//
//  メインビュー - WebViewをホスティングするルートビュー
//

import SwiftUI

struct MainView: View {
    @EnvironmentObject var sharedUrlManager: SharedUrlManager

    var body: some View {
        WebViewContainer()
            .ignoresSafeArea(.all, edges: .bottom)
    }
}

#Preview {
    MainView()
        .environmentObject(SharedUrlManager.shared)
}
