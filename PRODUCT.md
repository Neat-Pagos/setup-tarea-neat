# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Internal adoption-center staff reviewing Pokémon adoption requests and maintaining the Pokémon catalog.

## Product Purpose

Help staff review adoption requests, make safe approval or rejection decisions, and keep the adoptable Pokémon catalog accurate. Success means staff can understand queue state quickly, inspect applicant and Pokémon details without ambiguity, and complete decisions confidently.

## Positioning

An operations console built around the complete Pokémon adoption lifecycle: catalog availability, application review, approval or rejection, preparation, delivery, delivery failure, and security concerns.

## Operating Context

Staff move between an adoption-review queue, a Pokémon catalog, and a catalog creation form. Adoption records combine Pokémon details, applicant identity and contact information, timestamps, review history, and operational status.

## Capabilities and Constraints

- Review pending and in-review adoption requests.
- Approve or reject requests, optionally recording a rejection reason.
- Scan aggregate adoption counts by workflow state.
- Browse the registered Pokémon catalog and its availability or delivery state.
- Add a Pokémon with name, type, region, diet, and an optional image URL.
- Preserve the existing Spanish interface, API behavior, routes, data models, and workflow semantics.
- Use CSS placeholders wherever imagery is unavailable; do not generate imagery in this redesign.

## Brand Commitments

The product should feel unmistakably at home in Pokémon interfaces, informed by the supplied Pokémon GO detail screen and modern Pokédex mobile UI references. The interface remains an internal operational tool, so clarity and decision safety outrank decorative fidelity or game-like behavior.

## Evidence on Hand

- Existing React interface and working Express/Firebase-backed workflows.
- Two user-supplied visual references showing bright type colors, rounded surfaces, creature-led composition, compact metadata, and Pokédex motifs.
- Existing records may provide remote Pokémon image URLs. No new generated image assets are approved for this redesign.
- No testimonials, external brand kit, or commercial claims are available and none should be fabricated.

## Product Principles

1. Make queue state and next actions obvious at a glance.
2. Treat approval, rejection, delivery, and security states as consequential operational decisions.
3. Bring Pokémon character through a coherent system, not ornamental clutter.
4. Keep dense applicant and record data readable on desktop and mobile.
5. Preserve honest workflow state and provide clear feedback during loading, failure, and updates.

## Accessibility & Inclusion

Status and action meaning must never rely on color alone. Keyboard focus, readable contrast, responsive layouts, semantic controls, and reduced-motion preferences are required.
