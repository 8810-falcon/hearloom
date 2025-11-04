//
//  HearloomApp.swift
//  Hearloom
//
//  Created by 小椋　隼 on 2025/11/04.
//

import SwiftUI

@main
struct HearloomApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
