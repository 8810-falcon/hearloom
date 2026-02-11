//
//  SongInfoCard.swift
//  Hearloom
//
//  曲情報カード
//  アルバムアート + 曲名 + アーティスト名
//

import SwiftUI

// MARK: - SongInfoCard

/// 曲情報カード
struct SongInfoCard: View {
    let song: Song
    let showServiceBadge: Bool

    init(song: Song, showServiceBadge: Bool = true) {
        self.song = song
        self.showServiceBadge = showServiceBadge
    }

    var body: some View {
        HStack(spacing: HearloomSpacing.paddingMD) {
            // アルバムアート
            AlbumArtView(url: song.albumArtUrl, size: HearloomSpacing.albumArtLarge)

            VStack(alignment: .leading, spacing: HearloomSpacing.space2) {
                // 曲名
                Text(song.title)
                    .font(HearloomFonts.semibold(size: HearloomFonts.sizeLG))
                    .foregroundStyle(HearloomColors.textPrimary)
                    .lineLimit(2)

                // アーティスト名
                Text(song.artist)
                    .font(HearloomFonts.body)
                    .foregroundStyle(HearloomColors.textSecondary)
                    .lineLimit(1)

                // アルバム名（あれば）
                if let albumName = song.albumName {
                    Text(albumName)
                        .font(HearloomFonts.small)
                        .foregroundStyle(HearloomColors.textTertiary)
                        .lineLimit(1)
                }

                // サービスバッジ
                if showServiceBadge {
                    ServiceBadge(source: song.source)
                        .padding(.top, HearloomSpacing.space1)
                }
            }

            Spacer()
        }
        .padding(HearloomSpacing.paddingMD)
        .background(HearloomColors.bgSurface)
        .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusXL))
        .overlay(
            RoundedRectangle(cornerRadius: HearloomSpacing.radiusXL)
                .stroke(HearloomColors.border, lineWidth: 1)
        )
    }
}

// MARK: - Compact Song Info

/// コンパクトな曲情報（一覧用）
struct CompactSongInfo: View {
    let song: Song

    var body: some View {
        HStack(spacing: HearloomSpacing.paddingMD) {
            // アルバムアート
            AlbumArtView(url: song.albumArtUrl, size: HearloomSpacing.albumArtThumbnail)

            VStack(alignment: .leading, spacing: 2) {
                // 曲名
                Text(song.title)
                    .font(HearloomFonts.semibold(size: HearloomFonts.sizeSM))
                    .foregroundStyle(HearloomColors.textPrimary)
                    .lineLimit(1)

                // アーティスト名
                Text(song.artist)
                    .font(HearloomFonts.caption)
                    .foregroundStyle(HearloomColors.textSecondary)
                    .lineLimit(1)
            }

            Spacer()
        }
    }
}

// MARK: - Album Art View

/// アルバムアート表示
struct AlbumArtView: View {
    let url: String?
    let size: CGFloat

    var body: some View {
        Group {
            if let urlString = url, let imageUrl = URL(string: urlString) {
                AsyncImage(url: imageUrl) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    case .failure:
                        placeholderView
                    case .empty:
                        ProgressView()
                            .tint(HearloomColors.textTertiary)
                    @unknown default:
                        placeholderView
                    }
                }
            } else {
                placeholderView
            }
        }
        .frame(width: size, height: size)
        .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD))
    }

    private var placeholderView: some View {
        ZStack {
            HearloomColors.bgBase
            Image(systemName: "music.note")
                .font(.system(size: size * 0.4))
                .foregroundStyle(HearloomColors.textMuted)
        }
        .overlay(
            RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD)
                .stroke(HearloomColors.border, lineWidth: 1)
        )
    }
}

// MARK: - Preview

#Preview("SongInfoCard") {
    VStack(spacing: HearloomSpacing.cardGap) {
        SongInfoCard(song: .preview)
        SongInfoCard(song: .previewSpotify)
    }
    .padding()
    .background(HearloomColors.bgBase)
}

#Preview("CompactSongInfo") {
    VStack(spacing: HearloomSpacing.cardGap) {
        CompactSongInfo(song: .preview)
        CompactSongInfo(song: .previewSpotify)
    }
    .padding()
    .background(HearloomColors.bgBase)
}
