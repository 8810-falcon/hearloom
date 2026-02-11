//
//  ServiceBadge.swift
//  Hearloom
//
//  音楽サービスバッジ
//

import SwiftUI

// MARK: - ServiceBadge

/// 音楽サービスバッジ（Apple Music / Spotify）
struct ServiceBadge: View {
    let source: MusicSource

    private var badgeColor: Color {
        switch source {
        case .appleMusic: return Color(hex: "#FA233B")
        case .spotify: return Color(hex: "#1DB954")
        }
    }

    private var badgeBgColor: Color {
        badgeColor.opacity(0.15)
    }

    var body: some View {
        Text(source.displayName)
            .font(.system(size: 10, weight: .medium))
            .tracking(0.02)
            .foregroundStyle(badgeColor)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(badgeBgColor)
            .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusSM))
    }
}

// MARK: - Preview

#Preview("Service Badges") {
    HStack(spacing: 12) {
        ServiceBadge(source: .appleMusic)
        ServiceBadge(source: .spotify)
    }
    .padding()
    .background(HearloomColors.bgBase)
}
