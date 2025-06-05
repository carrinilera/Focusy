import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Array "mo:base/Array";

actor {
  type Session = {
    startTime: Time.Time;
    durationMinutes: Nat;
    endTime: Time.Time;
  };

  stable var sessions: [Session] = [];

  public func addSession(durationMinutes: Nat) : async () {
    let start = Time.now();
    let end = start + (durationMinutes * 60 * 1_000_000_000); // convert to nanoseconds
    let newSession : Session = {
      startTime = start;
      durationMinutes = durationMinutes;
      endTime = end;
    };
    sessions := Array.append(sessions, [newSession]);
  };

  public query func getSessions() : async [Session] {
    sessions
  };

  public func clearSessions() : async () {
    sessions := [];
  };
}
