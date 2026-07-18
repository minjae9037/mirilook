"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  CheckCircle2,
  Coins,
  ImagePlus,
  Info,
  Loader2,
  RefreshCw,
  Save,
  Upload,
  UserRound,
  Wallet,
} from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { formatHairMoney } from "@/lib/mirilook-payments";
import {
  getSupabaseAccessToken,
  getSupabaseBrowserClient,
} from "@/lib/supabase-browser";

type PhotoSlot = "left" | "front" | "right";

type ProfilePhoto = {
  fileName: string;
  path: string;
  url: string;
} | null;

type MirilookProfile = {
  avatarPhotoSlot: PhotoSlot | null;
  avatarUrl: string | null;
  bio: string;
  displayName: string;
  email: string;
  id: string;
  photos: Record<PhotoSlot, ProfilePhoto>;
  provider: string;
};

type HairMoneyLedgerItem = {
  amount: number;
  balanceAfter: number;
  createdAt: string;
  direction: "credit" | "debit" | "refund" | "adjustment";
  id: string;
  reason: string | null;
  sourceId: string;
  sourceType: string;
};

type HairMoneyWalletResponse = {
  balance?: number;
  ledger?: HairMoneyLedgerItem[];
  reason?: string;
  recommendationCost?: number;
  synced?: boolean;
  totalPurchased?: number;
  totalSpent?: number;
};

const photoSlotConfig: Array<{
  description: string;
  label: string;
  slot: PhotoSlot;
}> = [
  {
    description: "왼쪽 얼굴선과 옆머리 볼륨을 저장합니다.",
    label: "좌측면 사진",
    slot: "left",
  },
  {
    description: "추천 정확도에 가장 중요한 기준 사진입니다.",
    label: "정면 사진",
    slot: "front",
  },
  {
    description: "오른쪽 얼굴선과 두상 방향을 보완합니다.",
    label: "우측면 사진",
    slot: "right",
  },
];

const profilePhotoMaxBytes = 1_100_000;
const profilePhotoMaxSides = [1280, 1024, 896, 768, 640];
const profilePhotoQualities = [0.76, 0.66, 0.56, 0.48];

export function MirilookProfilePanel() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const fileRefs = {
    front: useRef<HTMLInputElement>(null),
    left: useRef<HTMLInputElement>(null),
    right: useRef<HTMLInputElement>(null),
  };
  const previewUrlsRef = useRef<Set<string>>(new Set());
  const [profile, setProfile] = useState<MirilookProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [files, setFiles] = useState<Partial<Record<PhotoSlot, File>>>({});
  const [previews, setPreviews] = useState<Partial<Record<PhotoSlot, string>>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [savingAvatarSlot, setSavingAvatarSlot] = useState<PhotoSlot | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    const previewUrls = previewUrlsRef.current;

    async function loadInitialProfile() {
      setIsLoading(true);
      setStatus("");

      try {
        const token = await getSupabaseAccessToken();

        if (!active) {
          return;
        }

        if (!token) {
          setProfile(null);
          setStatus("마이페이지를 사용하려면 먼저 로그인해 주세요.");
          return;
        }

        const response = await fetch("/api/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = (await response.json().catch(() => null)) as {
          error?: string;
          profile?: MirilookProfile;
        } | null;

        if (!active) {
          return;
        }

        if (!response.ok || !result?.profile) {
          setStatus(result?.error ?? "프로필을 불러오지 못했습니다.");
          return;
        }

        setProfile(result.profile);
        setDisplayName(result.profile.displayName);
        setBio(result.profile.bio);
      } catch (error) {
        console.error(error);

        if (active) {
          setStatus("프로필을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialProfile();

    return () => {
      active = false;
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.clear();
    };
  }, []);

  async function saveProfile() {
    const nextDisplayName = displayName.trim();

    if (!nextDisplayName) {
      setStatus("닉네임을 입력해 주세요.");
      return;
    }

    setIsSaving(true);
    setStatus("프로필을 저장하는 중입니다.");

    try {
      const token = await getSupabaseAccessToken();

      if (!token) {
        setStatus("로그인 후 프로필을 저장할 수 있습니다.");
        return;
      }

      const response = await fetch("/api/profile/", {
        body: JSON.stringify({
          bio,
          displayName: nextDisplayName,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
        profile?: MirilookProfile;
      } | null;

      if (!response.ok || !result?.profile) {
        setStatus(result?.error ?? "프로필 저장에 실패했습니다.");
        return;
      }

      if (supabase) {
        await supabase.auth.updateUser({
          data: {
            full_name: nextDisplayName,
            name: nextDisplayName,
          },
        });
      }

      setProfile(result.profile);
      setStatus("닉네임과 자기소개를 저장했습니다.");
    } catch (error) {
      console.error(error);
      setStatus("프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveAvatarPhoto(slot: PhotoSlot) {
    const nextDisplayName = displayName.trim();

    if (!nextDisplayName) {
      setStatus("닉네임을 입력한 뒤 프로필 사진을 저장해 주세요.");
      return;
    }

    if (!profile?.photos[slot]) {
      setStatus("먼저 저장된 사진 중에서 프로필 사진을 선택해 주세요.");
      return;
    }

    setSavingAvatarSlot(slot);
    setStatus("프로필 사진을 저장하는 중입니다.");

    try {
      const token = await getSupabaseAccessToken();

      if (!token) {
        setStatus("로그인 후 프로필 사진을 저장할 수 있습니다.");
        return;
      }

      const response = await fetch("/api/profile/", {
        body: JSON.stringify({
          avatarPhotoSlot: slot,
          bio,
          displayName: nextDisplayName,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
        profile?: MirilookProfile;
      } | null;

      if (!response.ok || !result?.profile) {
        setStatus(
          toProfilePhotoStatusMessage(result?.error) ??
            "프로필 사진 저장에 실패했습니다.",
        );
        return;
      }

      setProfile(result.profile);
      setDisplayName(result.profile.displayName);
      setBio(result.profile.bio);
      setStatus("프로필 사진을 저장했습니다. DM 대화함에도 이 사진이 표시됩니다.");
    } catch (error) {
      console.error(error);
      setStatus("프로필 사진 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSavingAvatarSlot(null);
    }
  }

  function handleFileChange(
    slot: PhotoSlot,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatus("이미지 파일만 업로드할 수 있습니다.");
      event.target.value = "";
      return;
    }

    const previousPreview = previews[slot];

    if (previousPreview) {
      URL.revokeObjectURL(previousPreview);
      previewUrlsRef.current.delete(previousPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    previewUrlsRef.current.add(previewUrl);
    setFiles((current) => ({ ...current, [slot]: file }));
    setPreviews((current) => ({ ...current, [slot]: previewUrl }));
    setStatus(`${getPhotoLabel(slot)} 업로드 후보를 선택했습니다. 저장을 눌러 반영해 주세요.`);
    event.target.value = "";
  }

  async function uploadPhotos() {
    const selectedSlots = photoSlotConfig
      .map((item) => item.slot)
      .filter((slot) => files[slot]);

    if (!selectedSlots.length) {
      setStatus("저장할 사진을 먼저 선택해 주세요.");
      return;
    }

    setIsUploading(true);
    setStatus("선택한 사진을 웹 저장용으로 압축하는 중입니다.");

    try {
      const token = await getSupabaseAccessToken();

      if (!token) {
        setStatus("로그인 후 사진을 저장할 수 있습니다.");
        return;
      }

      const preparedPhotos = await Promise.all(
        selectedSlots.map(async (slot) => {
          const file = files[slot];

          if (!file) {
            throw new Error(`${getPhotoLabel(slot)} 파일을 찾지 못했습니다.`);
          }

          return [slot, await prepareProfilePhotoFile(file)] as const;
        }),
      );
      const formData = new FormData();

      preparedPhotos.forEach(([slot, file]) => {
        formData.append(`${slot}Photo`, file, file.name);
      });

      setStatus("내 사진을 저장하는 중입니다.");

      const response = await fetch("/api/profile/", {
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
        profile?: MirilookProfile;
      } | null;

      if (!response.ok || !result?.profile) {
        setStatus(
          toProfilePhotoStatusMessage(result?.error) ??
            "사진 저장에 실패했습니다.",
        );
        return;
      }

      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current.clear();
      setFiles({});
      setPreviews({});
      setProfile(result.profile);
      setStatus("내 사진을 저장했습니다. 홈에서 바로 불러와 추천에 사용할 수 있습니다.");
    } catch (error) {
      console.error(error);
      setStatus(
        error instanceof Error
          ? error.message
          : "사진 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function prepareProfilePhotoFile(file: File) {
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      throw new Error("JPG, PNG, WebP 형식의 이미지 파일만 저장할 수 있습니다.");
    }

    const sourceUrl = URL.createObjectURL(file);

    try {
      const image = await loadImage(sourceUrl);
      const maxSourceSide = Math.max(image.naturalWidth, image.naturalHeight);

      if (!maxSourceSide) {
        throw new Error("사진 크기를 확인하지 못했습니다.");
      }

      let smallestBlob: Blob | null = null;

      for (const maxSide of profilePhotoMaxSides) {
        const scale = Math.min(1, maxSide / maxSourceSide);
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("브라우저에서 사진을 처리하지 못했습니다.");
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        for (const quality of profilePhotoQualities) {
          const blob = await canvasToJpegBlob(canvas, quality);

          if (!smallestBlob || blob.size < smallestBlob.size) {
            smallestBlob = blob;
          }

          if (blob.size <= profilePhotoMaxBytes) {
            return new File([blob], toJpegName(file.name), {
              lastModified: file.lastModified,
              type: "image/jpeg",
            });
          }
        }
      }

      if (smallestBlob) {
        throw new Error(
          "사진 용량이 너무 큽니다. 화면 캡처본이나 더 작은 사진으로 다시 저장해 주세요.",
        );
      }

      throw new Error("사진 압축에 실패했습니다.");
    } finally {
      URL.revokeObjectURL(sourceUrl);
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-lg border border-white/12 bg-[#171511]/92 p-5">
        <div className="flex items-center gap-2 text-[#f3d28a]">
          <Loader2 aria-hidden="true" className="animate-spin" size={18} />
          <p className="text-sm font-semibold">마이페이지를 불러오는 중입니다.</p>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="rounded-lg border border-white/12 bg-[#171511]/92 p-5">
        <div className="flex items-center gap-2">
          <UserRound aria-hidden="true" className="text-[#f3d28a]" size={20} />
          <h2 className="text-xl font-semibold text-[#fffaf1]">로그인이 필요합니다</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-[#b8aa95]">
          닉네임, 자기소개, 기본 사진을 저장하려면 먼저 로그인해 주세요.
        </p>
        <Link
          className="mt-4 inline-flex h-10 items-center rounded-md bg-[#f3d28a] px-4 text-sm font-bold text-[#1a1712]"
          href="/login"
        >
          로그인하러 가기
        </Link>
      </section>
    );
  }

  return (
    <section className="grid min-w-0 grid-cols-1 gap-5 rounded-lg border border-white/12 bg-[#171511]/92 p-4 shadow-2xl shadow-black/40 backdrop-blur md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <UserRound aria-hidden="true" className="text-[#f3d28a]" size={20} />
            <h2 className="text-xl font-semibold text-[#fffaf1]">마이페이지</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#b8aa95]">
            계정 닉네임과 자기소개를 관리하고, 홈에서 바로 불러올 기준 사진을 저장합니다.
          </p>
        </div>
        <p className="rounded-md border border-[#c9a96a]/35 bg-[#201a12]/80 px-3 py-2 text-sm font-semibold text-[#f3d28a]">
          {profile.email}
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 rounded-md border border-[#2b281f] bg-[#0f0e0c]/72 p-4">
          <h3 className="text-base font-semibold text-[#fffaf1]">
            계정 정보
          </h3>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1 text-sm font-semibold text-[#e7dccb]">
              닉네임
              <input
                className="h-11 rounded-md border border-white/10 bg-[#11100e] px-3 text-sm text-[#fffaf1] outline-none transition placeholder:text-[#8f826f] focus:border-[#f3d28a]/70"
                maxLength={40}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="예: 미리룩 대표님"
                value={displayName}
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold text-[#e7dccb]">
              자기소개
              <textarea
                className="min-h-32 resize-y rounded-md border border-white/10 bg-[#11100e] px-3 py-3 text-sm leading-6 text-[#fffaf1] outline-none transition placeholder:text-[#8f826f] focus:border-[#f3d28a]/70"
                maxLength={600}
                onChange={(event) => setBio(event.target.value)}
                placeholder="선호하는 분위기, 직업/라이프스타일, 미용실 상담 때 남기고 싶은 내용을 적어두세요."
                value={bio}
              />
            </label>
            <button
              className="inline-flex h-11 w-fit items-center gap-2 rounded-md bg-[#f3d28a] px-4 text-sm font-bold text-[#1a1712] transition hover:bg-[#ffdf98] disabled:cursor-not-allowed disabled:bg-[#675737] disabled:text-[#b8aa95]"
              disabled={isSaving}
              onClick={() => void saveProfile()}
              type="button"
            >
              {isSaving ? (
                <Loader2 aria-hidden="true" className="animate-spin" size={16} />
              ) : (
                <Save aria-hidden="true" size={16} />
              )}
              프로필 저장
            </button>
          </div>
        </div>

        <aside className="rounded-md border border-[#2b281f] bg-[#0f0e0c]/72 p-4">
          <h3 className="text-base font-semibold text-[#fffaf1]">
            저장된 사진 사용법
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#b8aa95]">
            아래 기준 사진을 저장해두면 홈 화면에서 <span className="text-[#f3d28a]">내 사진 불러오기</span>로
            바로 추천을 시작할 수 있습니다.
          </p>
          <div className="mt-4 rounded-md border border-[#c9a96a]/30 bg-[#2b2113]/70 p-3 text-sm leading-6 text-[#e7dccb]">
            <CheckCircle2 aria-hidden="true" className="mb-2 text-[#f3d28a]" size={18} />
            3장을 모두 저장하면 좌우 얼굴선과 두상 정보를 더 안정적으로 반영합니다.
          </div>
        </aside>
      </div>

      <HairMoneyAccountTab />

      <div className="rounded-md border border-[#2b281f] bg-[#0f0e0c]/72 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#fffaf1]">
              추천용 내 사진
            </h3>
            <p className="mt-1 text-sm text-[#b8aa95]">
              좌측면, 정면, 우측면 사진을 저장해두면 홈에서 다시 업로드하지 않아도 됩니다.
            </p>
          </div>
          <button
            className="inline-flex h-10 w-fit items-center gap-2 rounded-md bg-[#f3d28a] px-4 text-sm font-bold text-[#1a1712] transition hover:bg-[#ffdf98] disabled:cursor-not-allowed disabled:bg-[#675737] disabled:text-[#b8aa95]"
            disabled={isUploading}
            onClick={() => void uploadPhotos()}
            type="button"
          >
            {isUploading ? (
              <Loader2 aria-hidden="true" className="animate-spin" size={16} />
            ) : (
              <Upload aria-hidden="true" size={16} />
            )}
            선택한 사진 저장
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {photoSlotConfig.map((item) => {
            const previewUrl = previews[item.slot];
            const savedPhoto = profile.photos[item.slot];
            const imageUrl = previewUrl || savedPhoto?.url || "";
            const isAvatarPhoto = profile.avatarPhotoSlot === item.slot;
            const canUseAsAvatar = Boolean(savedPhoto) && !previewUrl;
            const isSavingAvatar = savingAvatarSlot === item.slot;

            return (
              <div
                className="overflow-hidden rounded-md border border-white/10 bg-[#11100e]"
                key={item.slot}
              >
                <input
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => handleFileChange(item.slot, event)}
                  ref={fileRefs[item.slot]}
                  type="file"
                />
                <button
                  className="group relative block aspect-[4/5] w-full overflow-hidden bg-[#171511] text-left"
                  onClick={() => fileRefs[item.slot].current?.click()}
                  type="button"
                >
                  {imageUrl ? (
                    <img
                      alt={item.label}
                      className="size-full object-cover transition group-hover:scale-[1.02]"
                      src={imageUrl}
                    />
                  ) : (
                    <span className="flex size-full flex-col items-center justify-center gap-3 text-[#8f826f]">
                      <ImagePlus aria-hidden="true" size={30} />
                      <span className="text-sm font-semibold">사진 선택</span>
                    </span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/86 to-transparent p-3">
                    <span className="block text-sm font-bold text-[#fffaf1]">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-xs text-[#d8cbb8]">
                      {previewUrl ? "저장 대기 중" : savedPhoto ? "저장됨" : "미등록"}
                    </span>
                  </span>
                </button>
                <div className="p-3">
                  <p className="text-sm leading-6 text-[#b8aa95]">
                    {item.description}
                  </p>
                  <button
                    className="mt-3 inline-flex h-9 items-center gap-2 rounded-md border border-white/12 px-3 text-xs font-bold text-[#e7dccb] transition hover:border-[#f3d28a]/60 hover:text-[#f3d28a]"
                    onClick={() => fileRefs[item.slot].current?.click()}
                    type="button"
                  >
                    <Upload aria-hidden="true" size={14} />
                    파일 선택
                  </button>
                  <button
                    className={`mt-2 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border px-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-55 ${
                      isAvatarPhoto
                        ? "border-[#f3d28a] bg-[#2f2516] text-[#f3d28a]"
                        : "border-white/12 text-[#e7dccb] hover:border-[#f3d28a]/60 hover:text-[#f3d28a]"
                    }`}
                    disabled={!canUseAsAvatar || Boolean(savingAvatarSlot)}
                    onClick={() => void saveAvatarPhoto(item.slot)}
                    type="button"
                  >
                    {isSavingAvatar ? (
                      <Loader2 aria-hidden="true" className="animate-spin" size={14} />
                    ) : (
                      <CheckCircle2 aria-hidden="true" size={14} />
                    )}
                    {isAvatarPhoto ? "프로필 사진으로 사용 중" : "프로필 사진으로 사용"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {status ? (
        <p className="rounded-md border border-white/10 bg-[#0f0e0c]/72 px-3 py-2 text-sm leading-6 text-[#b8aa95]">
          {status}
        </p>
      ) : null}
    </section>
  );
}

function HairMoneyAccountTab() {
  const [wallet, setWallet] = useState<HairMoneyWalletResponse>({
    balance: 0,
    ledger: [],
    recommendationCost: 0,
    synced: false,
    totalPurchased: 0,
    totalSpent: 0,
  });
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [walletStatus, setWalletStatus] = useState("H머니 잔액과 사용 이력을 확인하는 중입니다.");

  useEffect(() => {
    void refreshWallet();
  }, []);

  async function refreshWallet() {
    setIsLoadingWallet(true);
    setWalletStatus("H머니 잔액과 사용 이력을 확인하는 중입니다.");

    try {
      const token = await getSupabaseAccessToken();

      if (!token) {
        setWallet({
          balance: 0,
          ledger: [],
          recommendationCost: 0,
          synced: false,
          totalPurchased: 0,
          totalSpent: 0,
        });
        setWalletStatus("로그인 후 H머니 잔액과 사용 이력을 확인할 수 있습니다.");
        return;
      }

      const response = await fetch("/api/payments/hair-money/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = (await response.json().catch(() => ({
        balance: 0,
        ledger: [],
        reason: `server_${response.status}`,
        synced: false,
        totalPurchased: 0,
        totalSpent: 0,
      }))) as HairMoneyWalletResponse;

      setWallet({
        ...result,
        ledger: result.ledger ?? [],
        totalPurchased: result.totalPurchased ?? 0,
        totalSpent: result.totalSpent ?? 0,
      });
      setWalletStatus(getHairMoneyWalletStatus(result));
    } catch (error) {
      console.error(error);
      setWalletStatus("H머니 잔액과 사용 이력을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoadingWallet(false);
    }
  }

  const ledger = wallet.ledger ?? [];
  const balanceText = isLoadingWallet
    ? "확인 중"
    : `${formatHairMoney(wallet.balance)} HM`;
  const totalSpentText = isLoadingWallet
    ? "확인 중"
    : `${formatHairMoney(wallet.totalSpent)} HM`;
  const totalPurchasedText = isLoadingWallet
    ? "확인 중"
    : `${formatHairMoney(wallet.totalPurchased)} HM`;

  return (
    <div className="rounded-md border border-[#2b281f] bg-[#0f0e0c]/72 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Wallet aria-hidden="true" className="text-[#f3d28a]" size={18} />
            <h3 className="text-base font-semibold text-[#fffaf1]">
              H머니
            </h3>
          </div>
          <p className="mt-1 text-sm leading-6 text-[#b8aa95]">
            현재 보유 H머니와 추천·상담 생성에 사용한 이력을 관리합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/12 px-3 text-sm font-bold text-[#e7dccb] transition hover:border-[#f3d28a]/60 hover:text-[#f3d28a] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoadingWallet}
            onClick={() => void refreshWallet()}
            type="button"
          >
            {isLoadingWallet ? (
              <Loader2 aria-hidden="true" className="animate-spin" size={15} />
            ) : (
              <RefreshCw aria-hidden="true" size={15} />
            )}
            새로고침
          </button>
          <Link
            className="inline-flex h-10 items-center rounded-md bg-[#f3d28a] px-3 text-sm font-bold text-[#1a1712] transition hover:bg-[#ffdf98]"
            href="/store"
          >
            H머니 충전
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <HairMoneyMetric
          helper="추천과 추가 상담 생성에 사용할 수 있습니다."
          label="현재 보유"
          value={balanceText}
        />
        <HairMoneyMetric
          helper="추천·추가 상담 생성으로 차감된 누적 금액입니다."
          label="누적 사용"
          value={totalSpentText}
        />
        <HairMoneyMetric
          helper="충전, 보상, 조정으로 계정에 들어온 누적 H머니입니다."
          label="총 적립"
          value={totalPurchasedText}
        />
      </div>

      <div className="mt-4 rounded-md border border-white/10 bg-[#11100e]/88 p-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-[#fffaf1]">H머니 사용내역</p>
          <p className="text-xs font-semibold text-[#8f826f]">
            {walletStatus}
          </p>
        </div>

        {ledger.length ? (
          <div className="mt-3 grid gap-2">
            {ledger.map((item) => {
              const isDebit = item.direction === "debit";

              return (
                <div
                  className="grid gap-2 rounded-md border border-white/10 bg-[#0f0e0c]/86 p-3 md:grid-cols-[76px_minmax(0,1fr)_auto]"
                  key={item.id}
                >
                  <span
                    className={`w-fit rounded-md px-2 py-1 text-xs font-bold ${
                      isDebit
                        ? "bg-[#3a1c1c] text-[#ffb3a6]"
                        : "bg-[#17351f] text-[#b7e3bb]"
                    }`}
                  >
                    {getHairMoneyDirectionLabel(item.direction)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#fffaf1]">
                      {getHairMoneyReasonLabel(item)}
                    </p>
                    <p className="mt-1 text-xs text-[#8f826f]">
                      {formatHairMoneyDate(item.createdAt)} · 잔액{" "}
                      {formatHairMoney(item.balanceAfter)} HM
                    </p>
                  </div>
                  <p
                    className={`text-right text-sm font-bold ${
                      isDebit ? "text-[#ffb3a6]" : "text-[#b7e3bb]"
                    }`}
                  >
                    {getHairMoneyAmountPrefix(item.direction)}
                    {formatHairMoney(item.amount)} HM
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 rounded-md border border-white/10 bg-[#0f0e0c]/72 p-3 text-sm leading-6 text-[#8f826f]">
            아직 H머니 적립/사용 이력이 없습니다. H머니를 충전하거나 추천을 요청하면 이곳에
            기록됩니다.
          </p>
        )}
      </div>

      {/* PG(이니시스) 필수 고지 — 사용처·유효기간·청약철회·환불수단 안내. */}
      <div className="mt-4 rounded-md border border-[#f3d28a]/40 bg-[#f3d28a]/10 p-3">
        <div className="flex items-center gap-2">
          <Info aria-hidden="true" className="text-[#f3d28a]" size={16} />
          <p className="text-sm font-bold text-[#fffaf1]">H머니 이용·환불 안내</p>
        </div>
        <ul className="mt-2 grid gap-1.5 text-xs leading-5 text-[#e7dccb]">
          <li>
            · 사용처: 헤어스타일 추천, AI 상담용 이미지(9방향) 생성, 코디 추천
            등 미리룩 유료 기능.
          </li>
          <li>· 사용기간(유효기간): 충전한 유상 H머니는 충전일로부터 1년.</li>
          <li>
            · 구매 후 7일 이내 사용하지 않은 유상 H머니는 청약철회(취소·환불)할
            수 있습니다.
          </li>
          <li>· 환불은 결제 시 사용한 결제수단 또는 앱마켓 정책에 따라 처리됩니다.</li>
        </ul>
        <p className="mt-2 text-xs leading-5 text-[#8f826f]">
          자세한 내용은{" "}
          <Link className="font-semibold text-[#f3d28a] underline" href="/refund">
            취소·환불·교환 정책
          </Link>
          , 충전은{" "}
          <Link className="font-semibold text-[#f3d28a] underline" href="/store">
            H머니 스토어
          </Link>
          에서 확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

function HairMoneyMetric({
  helper,
  label,
  value,
}: {
  helper: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-[#11100e]/88 p-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-[#f3d28a]/40 bg-[#30271a] text-[#f3d28a]">
          <Coins aria-hidden="true" size={17} />
        </span>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8f826f]">
          {label}
        </p>
      </div>
      <p className="mt-3 truncate text-2xl font-bold text-[#fffaf1]">{value}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-[#8f826f]">
        {helper}
      </p>
    </div>
  );
}

function getHairMoneyWalletStatus(result: HairMoneyWalletResponse) {
  if (result.synced) {
    return "계정 H머니 이력을 불러왔습니다.";
  }

  if (result.reason === "not_authenticated") {
    return "로그인이 필요합니다.";
  }

  if (result.reason === "supabase_not_configured") {
    return "H머니 저장소 연결이 필요합니다.";
  }

  return "H머니 이력 확인이 지연되고 있습니다.";
}

function getHairMoneyDirectionLabel(direction: HairMoneyLedgerItem["direction"]) {
  switch (direction) {
    case "credit":
      return "적립";
    case "debit":
      return "사용";
    case "refund":
      return "환불";
    default:
      return "조정";
  }
}

function getHairMoneyReasonLabel(item: HairMoneyLedgerItem) {
  switch (item.reason) {
    case "community_post_reward":
      return "커뮤니티 피드 공유 보상";
    case "extra_consultation_set":
      return "추가 상담 이미지 생성 사용";
    case "hair_money_purchase":
      return "H머니 충전";
    case "style_recommendation":
      return "헤어스타일 추천 사용";
    case "style_recommendation_failed_refund":
    case "style_recommendation_refund":
      return "추천 실패/검토 환불";
    default:
      return item.reason || item.sourceType;
  }
}

function getHairMoneyAmountPrefix(direction: HairMoneyLedgerItem["direction"]) {
  if (direction === "debit") {
    return "-";
  }

  if (direction === "adjustment") {
    return "±";
  }

  return "+";
}

function formatHairMoneyDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getPhotoLabel(slot: PhotoSlot) {
  return photoSlotConfig.find((item) => item.slot === slot)?.label ?? "사진";
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(
        new Error(
          "사진을 읽지 못했습니다. JPG, PNG, WebP 사진으로 다시 시도해 주세요.",
        ),
      );
    image.src = src;
  });
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) => {
        if (value) {
          resolve(value);
        } else {
          reject(new Error("사진 압축에 실패했습니다."));
        }
      },
      "image/jpeg",
      quality,
    );
  });
}

function toJpegName(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "") || "mirilook-profile";

  return `${baseName}.jpg`;
}

function toProfilePhotoStatusMessage(error: string | undefined) {
  if (!error) {
    return null;
  }

  const messages: Record<string, string> = {
    invalid_avatar_photo_slot: "프로필 사진으로 사용할 저장 사진을 다시 선택해 주세요.",
    invalid_image_type: "JPG, PNG, WebP 형식의 이미지 파일만 저장할 수 있습니다.",
    payload_too_large:
      "사진 용량이 큽니다. 자동 압축 후에도 실패하면 더 작은 사진으로 다시 시도해 주세요.",
    profile_photo_not_found: "먼저 저장된 사진 중에서 프로필 사진을 선택해 주세요.",
    profile_photo_update_failed: "사진 경로를 프로필에 저장하지 못했습니다.",
    profile_photo_upload_failed: "사진 파일을 저장소에 업로드하지 못했습니다.",
    profile_storage_bucket_failed:
      "사진 저장소를 준비하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    profile_upload_failed: "사진 파일을 저장소에 업로드하지 못했습니다.",
  };

  return messages[error] ?? error;
}
